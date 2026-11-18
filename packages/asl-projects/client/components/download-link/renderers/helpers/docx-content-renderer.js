import {Paragraph, TextRun, Indent, Table, Media} from 'docx';
import { numbering, abstract, PURPLE } from './docx-style-helper'
import unified from 'unified';
import remarkParse from 'remark-parse';
import get from 'lodash/get';
import pickBy from "lodash/pickBy";
import mapValues from "lodash/mapValues";
import {stripInvalidXmlChars} from "../../../../helpers";

const applyFilter = (text, filter) => {
    if (typeof text !== 'string') {
        return String(text || '');
    }
    return filter ? filter(text) : text;
};

const splitTextIntoSegments = (rawText, { applyTextFilter } = {}) => {
    const filteredText = applyFilter(String(rawText || ''), applyTextFilter);
    return filteredText.split(/\r?\n/);
};

const appendTextWithLineBreaks = (paragraph, rawText, { applyTextFilter, marks = [] } = {}) => {
    const segments = splitTextIntoSegments(rawText, { applyTextFilter });

    segments.forEach((segment, segmentIndex) => {
        const textRun = new TextRun(segment);

        if (segmentIndex > 0) {
            textRun.break();
        }

        (marks || []).forEach(mark => {
            switch (mark.type) {
                case 'bold':
                    textRun.bold();
                    break;
                case 'italic':
                    textRun.italics();
                    break;
                case 'underlined':
                    textRun.underline();
                    break;
                case 'subscript':
                    textRun.subScript();
                    break;
                case 'superscript':
                    textRun.superScript();
                    break;
            }
        });

        paragraph.addRun(textRun);
    });
};

const renderMarkdown = (doc, markdown, style = 'body', { applyTextFilter } = {}, nts) => {
    const tree = unified().use(remarkParse).parse(markdown || '');

    (tree.children || []).forEach(node => {
        switch (node.type) {
            case 'heading': {
                const text = node.children.find(c => c.type === 'text')?.value || '';
                if (nts) {
                  const raSectionHeading = doc.createParagraph(applyFilter(text, applyTextFilter)).heading4();
                  raSectionHeading.Borders.addTopBorder(PURPLE, '6', 'single', '18');
                  raSectionHeading.createBorder();
                } else {
                  doc.createParagraph(applyFilter(text, applyTextFilter)).style(`Heading${node.depth}`);
                }
                break;
            }
            case 'paragraph': {
                const text = node.children.find(c => c.type === 'text')?.value || '';
                doc.createParagraph(applyFilter(text, applyTextFilter)).style(style);
                break;
            }
            case 'list': {
                (node.children || []).forEach(listItem => {
                    const text = get(listItem, 'children[0].children[0].value', '').trim();
                    const p = new Paragraph(applyFilter(text, applyTextFilter));
                    p.style(style);
                    p.bullet(0);
                    doc.addParagraph(p);
                });
                if (nts) {
                  renderHorizontalRule(doc).spacing({after: '240'});
                }
                break;
            }
        }
    });
};

function renderHorizontalRule(doc) {
  const para = doc.createParagraph().style('HorizontalRule');
  para.Borders.addBottomBorder(PURPLE, '1', 'single', '18');
  para.createBorder();
  return para;
}

const renderLabel = (doc, text) => {
    if (!text) { return; }
    doc.createParagraph(text).style('Question');
};

const renderNull = (doc, { separator } = {}) => {
    const p = new Paragraph();
    p.style('body');
    p.addRun(new TextRun('No answer provided').italics());
    doc.addParagraph(p);
    if (separator) { separator(doc); }
};

const renderText = (doc, value, { applyTextFilter, separator } = {}) => {
    if (typeof value === 'boolean') {
        doc.createParagraph(value ? 'Yes' : 'No').style('body');
    } else if (value == null || value === '') {
        return renderNull(doc, { separator });
    } else {
        const text = applyFilter(String(value), applyTextFilter);
        if (/[\r\n]/.test(text)) {
            const paragraph = new Paragraph();
            paragraph.style('body');
            appendTextWithLineBreaks(paragraph, text);
            doc.addParagraph(paragraph);
        } else {
            doc.createParagraph(text).style('body');
        }
    }
    if (separator) { separator(doc); }
};

const renderNode = (parent, node, depth = 0, paragraph, numbers, index, options = {}, document) => {
    const { applyTextFilter, customNodeRenderers } = options;

    const getContent = input => {
        const raw = get(input, 'nodes[0].leaves[0].text', get(input, 'nodes[0].text', ''));
        const text = (typeof raw === 'string' ? raw : '').trim();
        return applyFilter(text, applyTextFilter);
    };

    // Allow caller to override specific node types
    const renderer = customNodeRenderers?.[node.type];
    if (typeof renderer === 'function') {
      const renderNext = (nextParent, nextNode, nextDepth = depth, nextParagraph = paragraph, nextNumbers = numbers, nextIndex = index, options, document) =>
        renderNode(nextParent, nextNode, nextDepth, nextParagraph, nextNumbers, nextIndex, options, document);

        const context = { depth, paragraph, numbers, index, renderNext };
      return renderer(parent, node, context, document);
    }

    let text;
    let pg;
    let addToDoc;

    switch (node.type) {
        case 'list-item': {
            pg = new Paragraph();
            pg.style('body');
            numbers ? pg.setNumbering(numbers, depth) : pg.bullet(depth);
            parent.addParagraph(pg);
            (node.nodes || []).forEach((n, idx) => renderNode(parent, n, depth + 1, pg, null, idx, options));
            break;
        }
        case 'heading-one':
            parent.createParagraph(getContent(node)).heading1();
            break;
        case 'heading-two':
            parent.createParagraph(getContent(node)).heading2();
            break;
        case 'block-quote':
            parent.createParagraph(getContent(node)).style('aside');
            break;
        case 'paragraph':
        case 'block': {
            if (node.nodes && node.nodes.length === 1 && !getContent(node)) {
                return;
            }
            addToDoc = !paragraph;
            paragraph = paragraph || new Paragraph();
            (node.nodes || []).forEach((childNode, childNodeIndex) => {
                const leaves = childNode.leaves || [childNode];
                leaves.forEach(leaf => {
                    if (!addToDoc && (index > 0) && childNodeIndex === 0) {
                        text = new TextRun('');
                        text.break().break();
                        paragraph.addRun(text);
                    }
                    paragraph.style('body');
                    appendTextWithLineBreaks(paragraph, leaf.text || '', {
                        applyTextFilter,
                        marks: leaf.marks || []
                    });
                });
            });
            if (addToDoc) {
                parent.addParagraph(paragraph);
            }
            break;
        }
        case 'numbered-list': {
            if (abstract && numbering) {
                abstract
                    .createLevel(depth, 'decimal', '%2.', 'start')
                    .addParagraphProperty(new Indent(720 * (depth + 1), 0));
                const concrete = numbering.createConcreteNumbering(abstract);
                (node.nodes || []).forEach(item => renderNode(parent, item, depth, paragraph, concrete, undefined, options));
            } else {
                (node.nodes || []).forEach(item => renderNode(parent, item, depth, paragraph, undefined, undefined, options));
            }
            break;
        }
        case 'bulleted-list':
        (node.nodes || []).forEach(item => renderNode(parent, item, depth, paragraph, undefined, undefined, options, document));
            break;
        default:
            if (node.text) {
              renderNode(parent, { object: 'block', type: 'paragraph', nodes: [node] }, depth, paragraph, numbers, index, options, document);
            }
    }
};

const renderTextEditor = (doc, value, { onStringFallback, onError, separator, applyTextFilter, customNodeRenderers } = {}) => {
    let content = value;
    if (typeof value === 'string') {
        try {
            content = JSON.parse(value);
        } catch (e) {
            if (typeof onStringFallback === 'function') {
                onStringFallback(doc, value);
            }
            return;
        }
    }

    const nodes = get(content, 'document.nodes', []);
    const renderOptions = {
        applyTextFilter,
        customNodeRenderers
    };

    nodes.forEach(node => {
        try {
          renderNode(doc, node, 0, undefined, undefined, undefined, renderOptions, doc);
        } catch (err) {
            if (typeof onError === 'function') {
                onError(doc, err, node);
            } else {
                doc.createParagraph('There was a problem rendering this content').style('aside');
            }
        }
    });

    if (typeof separator === 'function') {
        separator(doc);
    }
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

const populateTable = (matrix, table, document) => {
  matrix.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        renderCell(table.getCell(rowIndex, colIndex), cell, document);
      }
    });
  });
};

const mergeCells = (matrix, table, document) => {
  populateTable(matrix, table, document);
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

const renderTable = (parent, node, document) => {
  const matrix = tableToMatrix(node);
  let table = initTable(matrix);

  try {
    mergeCells(matrix, table, document);
  } catch (err) {
    table = initTable(matrix);
    populateTable(matrix, table, document);
  }

  parent.addTable(table);
};

const customNodeRenderers = {
  'table-cell': (p, n, ctx = {}, document) => {
    (n.nodes || []).forEach(part => renderNode(p, part, ctx.depth, ctx.paragraph, ctx.numbers, ctx.index, {
      applyTextFilter: stripInvalidXmlChars,
      customNodeRenderers
    }, document));
  },
  'table': (p, n, ctx, document) => {
    renderTable(p, n, document);
  },
  'image': (p, n, ctx = {}, document) => {
    let pg = ctx.paragraph;
    if (pg === undefined) {
      pg = new Paragraph().style('imagebody');
    }
    pg.addImage(Media.addImage(document, n.data.src, n.data.width, n.data.height));
    p.addParagraph(pg);
  },
  'error': (p, n) => {
    const raw = get(n, 'nodes[0].leaves[0].text', get(n, 'nodes[0].text', ''));
    const content = stripInvalidXmlChars((raw || '').trim());
    p.createParagraph(content).style('error');
  }
};

const renderCell = (parent, node, document) => {
  return renderNode(parent, node, 0, undefined, 0, 0, {
    applyTextFilter: stripInvalidXmlChars,
    customNodeRenderers
  }, document);
};

const addImageDimensions = (values, updateImageDimensions) => {
  const updateNodes = nodes => {
    if (!Array.isArray(nodes)) {
      return Promise.resolve(nodes);
    }

    return Promise.all(nodes.map(node => {
      if (!node || typeof node !== 'object') {
        return Promise.resolve(node);
      }

      return Promise.resolve()
        .then(() => {
          if (node.type === 'image') {
            return updateImageDimensions(node);
          }
          return node;
        })
        .then(updatedNode => {
          if (Array.isArray(updatedNode.nodes)) {
            return updateNodes(updatedNode.nodes)
              .then(updatedChildren => {
                updatedNode.nodes = updatedChildren;
                return updatedNode;
              });
          }
          return updatedNode;
        });
    }));
  };

  const processTextEditorValue = value => {
    if ((typeof value !== 'object' && typeof value !== 'string') || value === null) {
      return Promise.resolve(value);
    }

    let valueWasJson = false;

    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
        valueWasJson = true;
      } catch (e) {
        return Promise.resolve(value);
      }
    }

    if (!value.document || !value.document.nodes) {
      return Promise.resolve(valueWasJson ? JSON.stringify(value) : value);
    }

    return updateNodes(value.document.nodes)
      .then(nodes => {
        value.document.nodes = nodes;
        return Promise.resolve(valueWasJson ? JSON.stringify(value) : value);
      });
  };

  const traverse = obj => {
    if (!obj || typeof obj !== 'object') {
      return Promise.resolve(obj);
    }

    const promises = Object.keys(obj).map(key => {
      const val = obj[key];

      if (Array.isArray(val)) {
        return Promise.all(val.map(item => traverse(item)))
          .then(items => { obj[key] = items; })
          .then(() => processTextEditorValue(obj[key]))
          .then(transformed => { obj[key] = transformed; });
      }

      if (val && typeof val === 'object') {
        return processTextEditorValue(val)
          .then(transformed => { obj[key] = transformed; })
          .then(() => traverse(obj[key]));
      }

      return processTextEditorValue(val)
        .then(transformed => { obj[key] = transformed; });
    });

    return Promise.all(promises).then(() => obj);
  };

  return traverse(values);
};

export { appendTextWithLineBreaks, renderMarkdown, renderLabel, renderNull, renderText, renderTextEditor, renderNode, splitTextIntoSegments, renderHorizontalRule, customNodeRenderers, addImageDimensions };
