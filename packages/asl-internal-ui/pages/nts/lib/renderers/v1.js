const { Paragraph, Table } = require('docx');

const renderTextEditor = require('../rich-text');

const hasPurpose = (project, purpose) => {
  let hasPurpose;
  if (purpose === 'translational-research') {
    hasPurpose = project.data['translational-research'] && project.data['translational-research'].length;
  } else {
    hasPurpose = (project.data['permissable-purpose'] || []).includes(purpose);
  }
  return hasPurpose ? 'X' : ' ';
};

const renderDuration = (doc, value) => {
  if (!value) {
    return;
  }
  let years = value.years === 1 ? 'Year' : 'Years';
  let months = value.months === 1 ? 'Month' : 'Months';
  doc.createParagraph(`${value.years} ${years} ${value.months} ${months}`).style('body');
};

const renderAnimalQuantities = (doc, data) => {
  const species = [
    ...data.species,
    ...(data['species-other'] || [])
  ];

  species.forEach(species => {
    const key = `reduction-quantities-${species}`;
    doc.createParagraph(`${species}: ${data[key] || '-'}`).style('body');
  });
};

const renderBoolean = (doc, value) => {
  doc.createParagraph(`${value ? 'Yes' : 'No'}`).style('body');
};

const render = (doc, project) => {

  const table = new Table({
    rows: 34,
    columns: 3,
    // setting to a large number enforces equal-width columns
    columnWidths: ['10000', '10000', '10000']
  });

  table.getRow(0).mergeCells(1, 2);
  table.getRow(1).mergeCells(1, 2);
  table.getRow(2).mergeCells(1, 2);
  table.getColumn(0).mergeCells(3, 10);

  table.getCell(0, 0).addParagraph(new Paragraph('Project').style('Heading2'));
  table.getCell(0, 1).addParagraph(new Paragraph(project.project.title).style('Heading2'));

  table.getCell(1, 0).addParagraph(new Paragraph('Key Words (max. 5 words)').style('body'));

  table.getCell(2, 0).addParagraph(new Paragraph('Expected duration of the project (yrs)').style('body'));
  renderDuration(table.getCell(2, 1), project.data.duration);

  table.getCell(3, 0).addParagraph(new Paragraph('Purpose of the project as in ASPA section 5C(3) (Mark all boxes that apply)').style('body'));

  table.getCell(3, 1).addParagraph(new Paragraph(hasPurpose(project, 'basic-research')).style('body'));
  table.getCell(3, 2).addParagraph(new Paragraph('Basic research').style('body'));

  table.getCell(4, 1).addParagraph(new Paragraph(hasPurpose(project, 'translational-research')).style('body'));
  table.getCell(4, 2).addParagraph(new Paragraph('Translational and applied research').style('body'));

  table.getCell(5, 1).addParagraph(new Paragraph(hasPurpose(project, 'safety-of-drugs')).style('body'));
  table.getCell(5, 2).addParagraph(new Paragraph('Regulatory use and routine production').style('body'));

  table.getCell(6, 1).addParagraph(new Paragraph(hasPurpose(project, 'protection-of-environment')).style('body'));
  table.getCell(6, 2).addParagraph(new Paragraph('Protection of the natural environment in the interests of the health or welfare of humans or animals').style('body'));

  table.getCell(7, 1).addParagraph(new Paragraph(hasPurpose(project, 'preservation-of-species')).style('body'));
  table.getCell(7, 2).addParagraph(new Paragraph('Preservation of species').style('body'));

  table.getCell(8, 1).addParagraph(new Paragraph(hasPurpose(project, 'higher-education')).style('body'));
  table.getCell(8, 2).addParagraph(new Paragraph('Higher education or training').style('body'));

  table.getCell(9, 1).addParagraph(new Paragraph(hasPurpose(project, 'forensic-enquiries')).style('body'));
  table.getCell(9, 2).addParagraph(new Paragraph('Forensic enquiries').style('body'));

  table.getCell(10, 1).addParagraph(new Paragraph(' ').style('body'));
  table.getCell(10, 2).addParagraph(new Paragraph('Maintenance of colonies of genetically altered animals').style('body'));

  let row = 10;

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('What\'s the aim of this project?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['project-aim']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('Why is it important to undertake this work?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['project-importance']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('What outputs do you think you will see at the end of this project?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['benefit-outputs']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('Who or what will benefit from these outputs, and how?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['benefit-who']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('Will this work be offered as a service to others?').style('body'));
  renderBoolean(table.getCell(row, 1), project.data['benefit-service']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('How will you look to maximise the outputs of this work?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['benefit-maximise-outputs']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('Explain why you are using these types of animals and your choice of life stages.').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['project-harms-animals']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('Typically, what will be done to an animal used in your project?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['project-harms-summary']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('What are the expected impacts and/or adverse effects for the animals during your project?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['project-harms-effects']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('What are the expected severities and the proportion of animals in each category (per animal type)?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['project-harms-severity']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('Will any animals not be killed at the end of this project?').style('body'));
  renderBoolean(table.getCell(row, 1), project.data['fate-of-animals-nts']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('Why do you need to use animals to achieve the aim of your project?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['replacement-why']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('Which non-animal alternatives did you consider for use in this project?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['replacement-alternatives']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('Why were they not suitable?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['replacement-justification']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('Enter the estimated number of animals of each type used in this project.').style('body'));
  renderAnimalQuantities(table.getCell(row, 1), project.data);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('How have you estimated the numbers of animals you will use?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['reduction-estimation']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('What steps did you take during the experimental design phase to reduce the number of animals being used in this project?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['reduction-steps']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('What measures, apart from good experimental design, will you use to optimise the number of animals you plan to use in your project?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['reduction-review']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('Which animal models and methods will you use during this project?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['refinement-models']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('Why can’t you use animals that are less sentient?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['refinement-less-sentient']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('How will you stay informed about advances in the 3Rs, and implement these advances effectively, during the project?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['refinement-3rs-advances']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('How will you refine the procedures you\'re using to minimise the welfare costs (harms) for the animals?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['refinement-explaination']);

  table.getRow(++row).mergeCells(1, 2);
  table.getCell(row, 0).addParagraph(new Paragraph('What published best practice guidance will you follow to ensure experiments are conducted in the most refined way?').style('body'));
  renderTextEditor(table.getCell(row, 1), project.data['refinement-published-guidance']);

  doc.addTable(table);

  return doc;
};

module.exports = render;
