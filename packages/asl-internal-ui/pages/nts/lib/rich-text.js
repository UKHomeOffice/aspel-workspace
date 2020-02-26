const { Paragraph, TextRun, Numbering, Indent, Table } = require('docx');
const { get, pickBy, mapValues } = require('lodash');

const renderTextEditor = (doc, value) => {

  const numbering = new Numbering();
  const abstract = numbering.createAbstractNumbering();

  const stripInvalidXmlChars = text => {
    if (typeof text !== 'string') {
      return text;
    }
    // eslint-disable-next-line no-control-regex
    return text.replace(/([^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFC\u{10000}-\u{10FFFF}])/ug, '');
  };

  const tableToMatrix = table => {
    const rows = table.nodes;
    let rowspans = [];
    let colcount = 0;

    // calculate the actual dimensions of the table
    rows.forEach((row, rowIndex) => {
      const cells = row.nodes;
      const columnsInRow = cells
        .slice(0, -1)
        .map(cell => parseInt(get(cell, 'data.colSpan', 1), 10) || 1)
        .reduce((sum, num) => sum + num, 1);

      colcount = Math.max(colcount, columnsInRow + rowspans.length);

      // reduce rowspans by one for next row.
      rowspans = [
        ...rowspans,
        ...cells.map(cell => {
          const rs = parseInt(get(cell, 'data.rowSpan', 1), 10);
          // All falsy values _except_ 0 should be 1
          // rowspan === 0 => fill the rest of the table
          return rs || (rs === 0 ? rows.length - rowIndex : 1);
        })
      ]
        .map(s => s - 1)
        .filter(Boolean);
    });

    const matrix = Array(rows.length).fill().map(() => Array(colcount).fill(undefined));

    let rowspanStore = {};
    rows.forEach((row, rowIndex) => {
      let spanOffset = 0;
      row.nodes.forEach((cell, colIndex) => {
        colIndex += spanOffset;
        // increase index and offset if previous row rowspan is active for col
        while (get(rowspanStore, colIndex, 0)) {
          spanOffset += 1;
          colIndex += 1;
        }

        // store rowspan to be taken into account in the next row
        const rs = parseInt(get(cell, 'data.rowSpan', 1), 10);
        const cs = parseInt(get(cell, 'data.colSpan', 1), 10);
        rowspanStore[colIndex] = rs || (rs === 0 ? rows.length - rowIndex : 1);
        const colspan = cs || (cs === 0 ? colcount - colIndex : 1);

        // increase offset for next cell
        spanOffset += (colspan - 1);

        // store in correct position
        matrix[rowIndex][colIndex] = cell;
      });

      // reduce rowspans by one for next row.
      rowspanStore = pickBy(mapValues(rowspanStore, s => s - 1), Boolean);
    });

    return matrix;
  };

  const populateTable = (matrix, table) => {
    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          renderNode(table.getCell(rowIndex, colIndex), cell);
        }
      });
    });
  };

  const mergeCells = (matrix, table) => {
    populateTable(matrix, table);
    // merge rows
    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const rowSpan = parseInt(get(cell, 'data.rowSpan'), 10);
        if (rowSpan) {
          table.getColumn(colIndex).mergeCells(rowIndex, rowIndex + rowSpan - 1);
        }
      });
    });
    // merge cols
    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const colSpan = parseInt(get(cell, 'data.colSpan'), 10);
        if (colSpan) {
          table.getRow(rowIndex).mergeCells(colIndex, colIndex + colSpan - 1);
        }
      });
    });
  };

  const initTable = matrix => {
    const rowcount = matrix.length;
    const colcount = matrix[0].length;

    return new Table({
      rows: rowcount,
      columns: colcount,
      // setting to a large number enforces equal-width columns
      columnWidths: Array(colcount).fill('10000')
    });
  };

  const renderTable = (node) => {
    const matrix = tableToMatrix(node);
    let table = initTable(matrix);

    try {
      mergeCells(matrix, table);
    } catch (err) {
      console.log('Failed to merge cells', err);
      table = initTable(matrix);
      populateTable(matrix, table);
    }

    doc.addTable(table);
  };

  const renderNode = (node, depth = 0, paragraph) => {
    let text;

    const getContent = input => {
      return get(input, 'nodes[0].leaves[0].text', get(input, 'nodes[0].text')).trim();
    };

    const renderListItem = (item, numbering) => {
      if (item.type !== 'list-item') {
        return renderNode(item);
      }

      paragraph = paragraph = new Paragraph();
      paragraph.style('body');

      numbering
        ? paragraph.setNumbering(numbering, depth)
        : paragraph.bullet();

      item.nodes.forEach(n => renderNode(n, depth + 1, paragraph));
    };

    switch (node.type) {
      case 'heading-one':
        doc.createParagraph(getContent(node)).heading1();
        break;

      case 'heading-two':
        doc.createParagraph(getContent(node)).heading2();
        break;

      case 'block-quote':
        doc.createParagraph(getContent(node)).style('aside');
        break;

      case 'table-cell':
        node.nodes.forEach(part => renderNode(part));
        break;

      case 'table':
        renderTable(node);
        break;

      case 'numbered-list': {
        abstract.createLevel(depth, 'decimal', '%2.', 'start').addParagraphProperty(new Indent(720 * (depth + 1), 0));
        const concrete = numbering.createConcreteNumbering(abstract);
        node.nodes.forEach(item => renderListItem(item, concrete));
        break;
      }

      case 'bulleted-list':
        node.nodes.forEach(item => renderListItem(item));
        break;

      case 'paragraph':
      case 'block':
        paragraph = paragraph || new Paragraph();
        node.nodes.forEach(childNode => {
          const leaves = childNode.leaves || [childNode];
          leaves.forEach(leaf => {
            text = new TextRun(stripInvalidXmlChars(leaf.text));
            if (text) {
              (leaf.marks || []).forEach(mark => {
                switch (mark.type) {
                  case 'bold':
                    text.bold();
                    break;

                  case 'italic':
                    text.italics();
                    break;

                  case 'underlined':
                    text.underline();
                    break;

                  case 'subscript':
                    text.subScript();
                    break;

                  case 'superscript':
                    text.superScript();
                    break;
                }
              });
              paragraph.style('body');
              paragraph.addRun(text);
            }
          });
        });
        doc.addParagraph(paragraph);
        break;

      case 'image':
        doc.createImage(node.data.src, node.data.width, node.data.height);
        break;

      default:
        // if there is no matching type then it's probably a denormalised text node with no wrapping paragraph
        // attempt to render with the node wrapped in a paragraph
        if (node.text) {
          renderNode({ object: 'block', type: 'paragraph', nodes: [ node ] }, depth, paragraph);
        }

    }
  };

  const content = JSON.parse(value || '{}');
  const nodes = get(content, 'document.nodes', []);
  nodes.forEach(node => {
    renderNode(node);
  });
};

module.exports = renderTextEditor;
