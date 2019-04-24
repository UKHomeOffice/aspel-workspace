const { Document, Packer, Paragraph, WidthType, TextRun, Numbering } = require('docx');
const { get } = require('lodash');

const pack = document => {
  const packer = new Packer();
  return packer.toBuffer(document);
};

const renderDuration = (doc, value) => {
  if (!value) {
    return;
  }
  let years = value.years === 1 ? 'Year' : 'Years';
  let months = value.months === 1 ? 'Month' : 'Months';
  doc.createParagraph(`${value.years} ${years} ${value.months} ${months}`).style('body');
};

const renderTextEditor = (doc, value) => {
  const content = JSON.parse(value || '{}');
  const nodes = get(content, 'document.nodes', []);
  nodes.forEach(node => {
    try {
      renderNode(doc, node);
    } catch (e) {
      console.log(e);
    }
  });
};

const renderNode = (doc, node) => {

  let text;
  let paragraph;

  switch (node.type) {
    case 'heading-one':
      doc.createParagraph(node.nodes[0].leaves[0].text.trim()).heading1();
      break;

    case 'heading-two':
      doc.createParagraph(node.nodes[0].leaves[0].text.trim()).heading2();
      break;

    case 'block-quote':
      doc.createParagraph(node.nodes[0].leaves[0].text.trim()).style('aside');
      break;

    case 'numbered-list': {
      const numbering = new Numbering();
      const abstract = numbering.createAbstractNumbering();
      abstract.createLevel(0, 'decimal', '%2.', 'start');
      const concrete = numbering.createConcreteNumbering(abstract);

      (node.nodes || []).forEach(n => {
        if (n.type !== 'list-item') {
          return renderNode(doc, n);
        }
        // TODO: the item may have marks
        text = new TextRun(n.nodes[0].leaves[0].text.trim()).size(24);
        const paragraph = new Paragraph();
        paragraph.setNumbering(concrete, 0);
        paragraph.style('body');
        paragraph.addRun(text);
        doc.addParagraph(paragraph);
      });
      break;
    }

    case 'bulleted-list':
      (node.nodes || []).forEach(n => {
        if (n.type !== 'list-item') {
          return renderNode(doc, n);
        }
        // TODO: the item may have marks
        text = new TextRun(n.nodes[0].leaves[0].text.trim()).size(24);
        const paragraph = new Paragraph();
        paragraph.style('body').bullet();
        paragraph.addRun(text);
        doc.addParagraph(paragraph);
      });
      break;

    case 'paragraph':
      paragraph = new Paragraph();
      node.nodes[0].leaves.forEach(leaf => {
        text = new TextRun(leaf.text);
        if (text) {
          leaf.marks.forEach(mark => {
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
            }
          });
          paragraph.style('body');
          paragraph.addRun(text);
        }
      });
      doc.addParagraph(paragraph);
      break;

    case 'image':
      doc.createImage(node.data.src, node.data.width, node.data.height);
      break;
  }
};

const addStyles = doc => {
  doc.Styles.createParagraphStyle('Heading1', 'Heading 1')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(36)
    .bold()
    .font('Helvetica')
    .spacing({ before: 360, after: 400 });

  doc.Styles.createParagraphStyle('Heading2', 'Heading 2')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(24)
    .bold()
    .font('Helvetica')
    .spacing({ before: 200, after: 200 });

  doc.Styles.createParagraphStyle('Heading3', 'Heading 3')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(28)
    .bold()
    .font('Helvetica')
    .spacing({ before: 400, after: 200 });

  doc.Styles.createParagraphStyle('body', 'Body')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(24)
    .font('Helvetica')
    .spacing({ before: 200, after: 200 });

  doc.Styles.createParagraphStyle('ListParagraph', 'List Paragraph')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(24)
    .font('Helvetica')
    .spacing({ before: 100, after: 100 });

  doc.Styles.createParagraphStyle('aside', 'Aside')
    .basedOn('Body')
    .next('Body')
    .quickFormat()
    .size(24)
    .color('999999')
    .italics();
};

module.exports = project => {

  return Promise.resolve()
    .then(() => new Document())
    .then(doc => {

      addStyles(doc);

      const table = doc.createTable({
        rows: 19,
        columns: 3
      });

      table.getCell(0, 1).Properties.setWidth('10%', WidthType.PCT);
      table.getCell(0, 2).Properties.setWidth('50%', WidthType.PCT);

      table.getRow(0).mergeCells(1, 2);
      table.getRow(1).mergeCells(1, 2);
      table.getRow(2).mergeCells(1, 2);
      table.getColumn(0).mergeCells(3, 10);
      table.getRow(11).mergeCells(1, 2);
      table.getRow(12).mergeCells(1, 2);
      table.getRow(13).mergeCells(1, 2);
      table.getRow(14).mergeCells(1, 2);
      table.getRow(15).mergeCells(1, 2);
      table.getRow(16).mergeCells(1, 2);
      table.getRow(17).mergeCells(1, 2);
      table.getRow(18).mergeCells(1, 2);

      table.getCell(0, 0).addParagraph(new Paragraph('Project').style('Heading2'));
      table.getCell(0, 1).addParagraph(new Paragraph(project.project.title).style('Heading2'));

      table.getCell(1, 0).addParagraph(new Paragraph('Key Words (max. 5 words)').style('body'));

      table.getCell(2, 0).addParagraph(new Paragraph('Expected duration of the project (yrs)').style('body'));
      renderDuration(table.getCell(2, 1), project.data.duration);

      table.getCell(3, 0).addParagraph(new Paragraph('Purpose of the project as in ASPA section 5C(3) (Mark all boxes that apply)').style('body'));

      table.getCell(3, 1).addParagraph(new Paragraph('  ').style('body'));
      table.getCell(3, 2).addParagraph(new Paragraph('Basic research').style('body'));
      table.getCell(4, 1).addParagraph(new Paragraph('  ').style('body'));
      table.getCell(4, 2).addParagraph(new Paragraph('Translational and applied research').style('body'));
      table.getCell(5, 1).addParagraph(new Paragraph('  ').style('body'));
      table.getCell(5, 2).addParagraph(new Paragraph('Regulatory use and routine production').style('body'));
      table.getCell(6, 1).addParagraph(new Paragraph('  ').style('body'));
      table.getCell(6, 2).addParagraph(new Paragraph('Protection of the natural environment in the interests of the health or welfare of humans or animals').style('body'));
      table.getCell(7, 1).addParagraph(new Paragraph('  ').style('body'));
      table.getCell(7, 2).addParagraph(new Paragraph('Preservation of species').style('body'));
      table.getCell(8, 1).addParagraph(new Paragraph('  ').style('body'));
      table.getCell(8, 2).addParagraph(new Paragraph('Higher education or training').style('body'));
      table.getCell(9, 1).addParagraph(new Paragraph('  ').style('body'));
      table.getCell(9, 2).addParagraph(new Paragraph('Forensic enquiries').style('body'));
      table.getCell(10, 1).addParagraph(new Paragraph('  ').style('body'));
      table.getCell(10, 2).addParagraph(new Paragraph('Maintenance of colonies of genetically altered animals').style('body'));

      table.getCell(11, 0).addParagraph(new Paragraph('Describe the objectives of the project (e.g. the scientific unknowns or scientific/clinical needs being addressed)').style('body'));
      renderTextEditor(table.getCell(11, 1), project.data['nts-objectives']);

      table.getCell(12, 0).addParagraph(new Paragraph('What are the potential benefits likely to derive from this project (how science could be advanced or humans or animals could benefit from the project)?').style('body'));
      renderTextEditor(table.getCell(12, 1), project.data['nts-benefits']);

      table.getCell(13, 0).addParagraph(new Paragraph('What species and approximate numbers of animals do you expect to use over what period of time?').style('body'));
      renderTextEditor(table.getCell(13, 1), project.data['nts-numbers']);

      table.getCell(14, 0).addParagraph(new Paragraph('In the context of what you propose to do to the animals, what are the expected adverse effects and the likely/expected level of severity? What will happen to the animals at the end?').style('body'));
      renderTextEditor(table.getCell(14, 1), project.data['nts-adverse-effects']);

      table.getCell(15, 0).addParagraph(new Paragraph('Application of the 3Rs').style('body'));

      table.getCell(16, 0)
        .addParagraph(new Paragraph('1. Replacement').style('Heading2'))
        .addParagraph(new Paragraph('State why you need to use animals and why you cannot use non-animal alternatives').style('body'));
      renderTextEditor(table.getCell(16, 1), project.data['nts-replacement']);

      table.getCell(17, 0)
        .addParagraph(new Paragraph('2. Reduction').style('Heading2'))
        .addParagraph(new Paragraph('Explain how you will assure the use of minimum numbers of animals').style('body'));
      renderTextEditor(table.getCell(17, 1), project.data['nts-reduction']);

      table.getCell(18, 0)
        .addParagraph(new Paragraph('3. Replacement').style('Heading2'))
        .addParagraph(new Paragraph('Explain the choice of species and why the animal model(s) you will use are the most refined, having regard to the objectives. Explain the general measures you will take to minimise welfare costs (harms) to the animals.').style('body'));
      renderTextEditor(table.getCell(18, 1), project.data['nts-refinement']);

      return pack(doc);
    });

};
