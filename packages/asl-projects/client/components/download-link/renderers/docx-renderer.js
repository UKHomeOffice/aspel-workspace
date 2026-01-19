import { Document, Paragraph, TextRun, Indent, Table, Media } from 'docx';
import flatten from 'lodash/flatten';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import { projectSpecies as SPECIES } from '@ukhomeoffice/asl-constants';
import { getLegacySpeciesLabel, mapSpecies, stripInvalidXmlChars, formatDate } from '../../../helpers';
import { DATE_FORMAT } from '../../../constants';
import { filterSpeciesByActive } from '../../../pages/sections/protocols/animals';
import protocolConditions from '../../../constants/protocol-conditions';
import { getRepeatedFromProtocolIndex, hydrateSteps } from '../../../helpers/steps';
import Mustache from 'mustache';
import { addStyles, renderHorizontalRule, numbering, abstract, addPageNumbers } from './helpers/docx-style-helper'
import { renderMarkdown as renderMarkdownContent, renderText as renderTextShared, renderNull as renderNullShared, renderNode as renderNodeShared } from './helpers/docx-content-renderer'

export default (application, sections, values, updateImageDimensions) => {
  const document = new Document();

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

  const renderTable = (doc, node) => {
    const matrix = tableToMatrix(node);
    let table = initTable(matrix);

    try {
      mergeCells(matrix, table);
    } catch (err) {
      table = initTable(matrix);
      populateTable(matrix, table);
    }

    doc.addTable(table);
  };

  const renderNode = (parent, node, depth = 0, paragraph, numbers, index) => {
    const customNodeRenderers = {
      'table-cell': (p, n, ctx) => {
        (n.nodes || []).forEach(part => renderNodeShared(p, part, depth, paragraph, numbers, index, {
          applyTextFilter: stripInvalidXmlChars,
          customNodeRenderers
        }));
      },
      'table': (p, n) => {
        renderTable(p, n);
      },
      'image': (p, n, ctx = {}) => {
        const pg = ctx.paragraph || new Paragraph();
        pg.addImage(Media.addImage(document, n.data.src, n.data.width, n.data.height));
        p.addParagraph(pg);
      },
      'error': (p, n) => {
        const raw = get(n, 'nodes[0].leaves[0].text', get(n, 'nodes[0].text', ''));
        const content = stripInvalidXmlChars((raw || '').trim());
        p.createParagraph(content).style('error');
      }
    };
    return renderNodeShared(parent, node, depth, paragraph, numbers, index, {
      applyTextFilter: stripInvalidXmlChars,
      customNodeRenderers
    });
  };

  const renderTextEditor = (doc, value, noSeparator) => {
    let content = value;
    if (typeof value === 'string') {
      try {
        content = JSON.parse(value);
      } catch (e) {
        return renderText(doc, value, noSeparator);
      }
    }
    const nodes = content.document.nodes;

    nodes.forEach(node => {
      try {
        renderNode(doc, node);
      } catch (e) {
        doc.createParagraph(`There was a problem rendering this content (${node.type})`).style('error');
        doc.createParagraph(e.stack).style('error');
      }
    });

    if (!noSeparator) {
      renderHorizontalRule(doc);
    }
  };

  const renderRadio = (doc, field, values, value, noSeparator) => {
    let option;

    if (field.options) {
      option = field.options.find(o => o.value === value);
    }

    const label = option ? option.label : value;
    doc.createParagraph(label).style('body');

    if (!noSeparator) {
      renderHorizontalRule(doc);
    }

    if (option && option.reveal) {
      [].concat(option.reveal).forEach(reveal => renderField(doc, reveal, values, null, true));
    }
  };

  const renderLegacySpecies = (doc, values, value, noSeparator) => {
    const label = getLegacySpeciesLabel(values);
    return renderText(doc, label, noSeparator);
  };

  const renderSpeciesSelector = (doc, values, value, noSeparator) => {
    const species = mapSpecies(values);

    if (!species.length) {
      return renderNull(doc);
    }

    species.forEach(value => {
      let text = new TextRun(value).size(24);

      const paragraph = new Paragraph();
      paragraph.style('body').bullet();
      paragraph.addRun(text);
      doc.addParagraph(paragraph);
    });

    if (!noSeparator) {
      renderHorizontalRule(doc);
    }
  };

  const renderAdditionalEstablishment = (doc, field, values, value, noSeparator) => {
    return renderText(doc, values.name || values['establishment-name'], noSeparator);
  };

  const renderKeywords = (doc, values, value, noSeparator) => {
    const keywords = value || [];

    if (!keywords.length) {
      return renderNull(doc);
    }

    keywords.forEach(value => {
      const text = new TextRun(value).size(24);
      const paragraph = new Paragraph();
      paragraph.style('body').bullet();
      paragraph.addRun(text);
      doc.addParagraph(paragraph);
    });

    if (!noSeparator) {
      renderHorizontalRule(doc);
    }
  };

  const renderPermissiblePurpose = (doc, field, value, values) => {
    value = value = Array.isArray(value) ? value : [value];
    const children = values[field.options.find(opt => opt.reveal).reveal.name] || [];
    if (!value.length && !children.length) {
      return renderNull(doc);
    }

    field.options.filter(opt => value.includes(opt.value) || (opt.reveal && children.length)).forEach(opt => {
      const text = new TextRun(opt.label).size(24);
      const paragraph = new Paragraph();
      paragraph.style('body').bullet();
      paragraph.addRun(text);
      doc.addParagraph(paragraph);
      if (opt && opt.reveal) {
        [].concat(opt.reveal).forEach(reveal => {
          renderField(doc, reveal, values, null, true);
        });
      }
    });

    renderHorizontalRule(doc);
  };

  const renderSelector = (doc, field, value, values, project, noSeparator) => {
    value = Array.isArray(value) ? value : [value];

    if (field.type === 'objective-selector') {
      const options = (project.objectives || []).map(o => o.title);
      value = value.filter(v => options.includes(v));
    }

    if (field.type === 'location-selector') {
      const est = project.transferToEstablishmentName || application.establishment.name;
      const options = [
        ...(est ? [est] : []),
        ...(project.establishments || []).map(e => e.name || e['establishment-name']),
        ...(project.polesList || []).map(p => p.title)
      ];
      value = value.filter(v => options.includes(v));
    }

    if (!value.length) {
      return renderNull(doc);
    }

    if (field.options) {
      value = value.filter(v => field.options.map(o => o.value).includes(v));
    }

    value.forEach(item => {
      const opt = (field.options || []).find(o => o.value === item);
      if (opt) {
        item = opt.label;
      }
      let text = new TextRun(item).size(24);
      const paragraph = new Paragraph();
      paragraph.style('body').bullet();
      paragraph.addRun(text);
      doc.addParagraph(paragraph);
      if (opt && opt.reveal) {
        [].concat(opt.reveal).forEach(reveal => {
          renderField(doc, reveal, values, null, true);
        });
      }
    });

    if (!noSeparator) {
      renderHorizontalRule(doc);
    }
  };

  const renderText = (doc, value, noSeparator) => {
    return renderTextShared(doc, value, {
      applyTextFilter: stripInvalidXmlChars,
      separator: noSeparator ? null : d => renderHorizontalRule(d)
    });
  };

  const renderDeclaration = (/*doc, field, values, value*/) => {

  };

  const renderDuration = (doc, value) => {
    let months = 0;
    let years = 5;
    if (value) {
      months = value.months || months;
      if (value.years === 0) {
        years = 0;
      } else {
        years = value.years || years;
      }
    }
    const yearsLabel = years === 1 ? 'Year' : 'Years';
    const monthsLabel = months === 1 ? 'Month' : 'Months';
    doc.createParagraph(`${years} ${yearsLabel} ${months} ${monthsLabel}`).style('body');
  };

  const renderNull = (doc, noSeparator) => {
    return renderNullShared(doc, {
      separator: noSeparator ? null : d => renderHorizontalRule(d)
    });
  };

  const renderAnimalQuantities = (doc, values, noSeparator) => {
    const species = [
      ...flatten((values.species || []).map(s => {
        if (s.indexOf('other') > -1) {
          return values[`species-${s}`];
        }
        return s;
      })),
      ...(values['species-other'] || [])
    ].map(s => {
      const opt = flatten(Object.values(SPECIES)).find(species => species.value === s);
      return {
        key: s && s.value,
        title: opt ? opt.label : s,
        value: values[`reduction-quantities-${s}`]
      };
    });

    if (!species.length) {
      return renderNull(doc);
    }

    const paragraph = new Paragraph();
    paragraph.style('body');

    species.map(s => {
      paragraph.addRun(new TextRun(`${s.title}: `).bold());
      s.value
        ? paragraph.addRun(new TextRun(s.value))
        : paragraph.addRun(new TextRun('No answer provided').italics());
    });

    doc.addParagraph(paragraph);
    if (!noSeparator) {
      renderHorizontalRule(doc);
    }

  };

  const renderField = (doc, field, values, project, noSeparator) => {
    project = project || values;
    if (field.show && !field.show(project)) {
      return false;
    }
    const value = values[field.name];

    if (!field.label && field.type === 'checkbox' && field.name.includes('declaration')) {
      return renderDeclaration(doc, field, values, value);
    }

    const context = { ...field, values };
    const renderedLabel = Mustache.render(field.review || field.label || '', context);
    doc.createParagraph(renderedLabel).style('Question');

    if (field.hint) {
      const renderedHint = Mustache.render(field.hint, context);
      renderMarkdown(doc, renderedHint, 'aside');
    }

    switch (field.type) {
      case 'species-selector':
        return renderSpeciesSelector(doc, values, value, noSeparator);
      case 'legacy-species-selector':
        return renderLegacySpecies(doc, values, value, noSeparator);
      case 'animal-quantities':
        return renderAnimalQuantities(doc, values, noSeparator);
      case 'keywords':
        return renderKeywords(doc, values, value, noSeparator);
      case 'duration':
        return renderDuration(doc, value, noSeparator);
      case 'licenceNumber': {
        const licenceNumber = application.licenceNumber ? application.licenceNumber : '';
        return renderText(doc, `${licenceNumber} `, noSeparator);
      }
      case 'establishment-selector': {
        if (value) {
          const receivingEstablishment = application.establishments.find(e => e.id === value);

          return receivingEstablishment
            ? renderText(doc, receivingEstablishment.name, noSeparator)
            : renderNull(doc, noSeparator);
        } else {
          return renderText(doc, application.establishment.name, noSeparator);
        }
      }
    }

    if (isUndefined(value) || isNull(value)) {
      return renderNull(doc, noSeparator);
    }

    switch (field.type) {
      case 'radio':
        return renderRadio(doc, field, values, value, noSeparator);

      case 'additional-availability':
        return renderAdditionalEstablishment(doc, field, values, value, noSeparator);

      case 'repeater':
        return (value || []).map(item => renderFields(doc, field, item, field.fields, project));

      case 'date':
        return renderText(doc, formatDate(value, DATE_FORMAT.long));

      case 'location-selector':
      case 'objective-selector':
      case 'checkbox':
        return renderSelector(doc, field, value, values, project, noSeparator);

      case 'permissible-purpose':
        return renderPermissiblePurpose(doc, field, value, values);

      case 'text':
      case 'textarea':
      case 'declaration':
        return renderText(doc, value, noSeparator);

      case 'holder':
        return renderText(doc, `${value.firstName} ${value.lastName}`, noSeparator);

      case 'texteditor':
        return renderTextEditor(doc, value, noSeparator);
    }

  };

  const renderFields = (doc, subsection, values, fields, project) => {
    if (fields) {
      return fields.forEach(field => renderField(doc, field, values, project));
    }

    const steps = (subsection.steps) ? subsection.steps : [{ 'fields': subsection.fields }];

    steps.filter(step => !step.show || step.show(values)).forEach(step => {
      if (step.repeats) {
        (values[step.repeats] || []).forEach((v, index) => {
          if (step.singular) {
            doc.createParagraph(`${step.singular} ${index + 1}`).heading4();
          }
          (step.fields || []).filter(f => f.repeats).forEach(field => renderField(doc, field, v, project));
        });
        (step.fields || []).filter(f => !f.repeats).forEach(field => renderField(doc, field, values, project));
      } else {
        (step.fields || []).forEach(field => renderField(doc, field, values, project));
      }
    });
  };

  const renderMarkdown = (doc, markdown, style = 'body') => {
    renderMarkdownContent(doc, markdown, style, { applyTextFilter: stripInvalidXmlChars });
  };

  const renderProtocolConditions = doc => {
    const markdown = `#### ${protocolConditions.title} \n` +
      `${protocolConditions.summary} \n` +
      // bump sub-headings from h3 -> h5, otherwise they look out of place
      `##${protocolConditions.anaesthesia} \n` +
      `##${protocolConditions.generalAnaesthesia} \n` +
      `##${protocolConditions.surgery} \n` +
      `##${protocolConditions.administration}`;

    return renderMarkdown(doc, markdown);
  };

  const renderProtocol = (doc, name, section, values, project, title) => {
    doc.createParagraph(`${title}: ${section.title}`).heading4();

    if (section.label) {
      doc.createParagraph(section.label).style('Question');
    }

    switch (name) {
      case 'steps':
        let [ steps ] = hydrateSteps(project.protocols, values.steps, project.reusableSteps || {});
        steps = steps.filter(step => !step.deleted);
        return (steps || []).forEach((stepValues, index) => {
          doc.createParagraph(`Step ${index + 1}${stepValues.reference ? `: ${stepValues.reference}` : ''} (${stepValues.optional ? 'optional' : 'mandatory'})`).heading4();
          const repeatedFrom = getRepeatedFromProtocolIndex(stepValues, values.id);
          if (repeatedFrom) {
            doc.createParagraph(`Repeated from protocol ${repeatedFrom}`).style('aside');
          }
          renderFields(doc, section, {...stepValues, readonly: true});
        });
      case 'animals':
        return filterSpeciesByActive(values, project).forEach(speciesValues => {
          doc.createParagraph(speciesValues.name).heading4();
          renderFields(
            doc,
            section,
            {
              ...speciesValues,
              speciesLabel: speciesValues.value?.replace(/-/g, ' ') ?? speciesValues.name?.toLowerCase()
            },
            section.fields.filter(f => f.name !== 'species')
          );
        });
      case 'legacy-animals':
        return (values.species || []).forEach((speciesValues, index) => {
          doc.createParagraph(`Animal type ${index + 1}`).heading4();
          renderFields(doc, section, speciesValues, section.fields);
        });
      default:
        return renderFields(doc, section, values, null, project);
    }
  };

  const renderProtocolsSection = (doc, subsection, values) => {
    const protocols = values['protocols'] || [];
    protocols.filter(protocol => !protocol.deleted).forEach((protocolValues, index) => {
      const title = `Protocol ${index + 1}`;
      doc.createParagraph(title).heading3();
      renderField(doc, subsection.fields[0], protocolValues);

      Object.keys(subsection.sections)
        .filter(k => !subsection.sections[k].show || subsection.sections[k].show(values))
        .map(k => renderProtocol(doc, k, subsection.sections[k], protocolValues, values, title));
    });
  };

  const renderSubsection = (doc, subsection, values) => {
    subsection.name !== 'protocols' && doc.createParagraph(subsection.title).heading3();

    if (subsection.name === 'protocol' || subsection.name === 'protocols') {
      if (application.schemaVersion > 0) {
        renderProtocolConditions(doc);
      }
      renderProtocolsSection(doc, subsection, values);
    } else if (subsection.docxRenderer != null) {
      subsection.docxRenderer(doc, values);
    } else {
      renderFields(doc, subsection, values);
    }
  };

  const renderSection = (doc, section, values) => {
    if (section.title) {
      const sectionTitle = new Paragraph(section.title).heading2();
      doc.addParagraph(sectionTitle);
    }
    if (section.subtitle) {
      doc.createParagraph(section.subtitle).heading2();
    }
    Object.values(section.subsections).filter(s => !s.show || s.show(values)).forEach(
      subsection => renderSubsection(doc, subsection, values)
    );
  };

  const renderNtsSection = (doc, section, values, sections) => {
    const sectionTitle = new Paragraph(section.title).style('SectionTitle');
    doc.addParagraph(sectionTitle);
    const subsections = sections.map(s => s.subsections).reduce((obj, values) => {
      return {
        ...obj,
        ...values
      };
    }, {});
    get(section, 'subsections[nts-review].sections', []).forEach(s => {
      let fields;
      const subsection = subsections[s.section];
      if (s.fields) {
        fields = subsection.fields.filter(field => s.fields.includes(field.name));
      }
      doc.createParagraph(s.title).style('SectionTitle');
      renderFields(doc, subsection, values, fields);
    });
  };

  const renderDocument = (sections, values) => {
    values = values || {};
    const now = new Date();
    const primaryEstablishment = application.establishment.name;

    // inject the project licence holder into introductory details
    const field = {
      label: 'Licence holder',
      name: 'holder',
      type: 'holder'
    };
    sections[0].subsections['introduction'].fields.splice(1, 0, field);
    values['holder'] = application.licenceHolder;

    document.createParagraph(values.title).heading1();
    document.createParagraph(`Document exported on ${now}`).style('body');

    document.createParagraph('\n').style('body');
    document.createParagraph('\n').style('body');
    document.createParagraph('\n').style('body');
    document.createParagraph('\n').style('body');

    document.createParagraph('Applicant').style('Question');
    document.createParagraph(application.licenceHolder.name).style('body');

    document.createParagraph('Primary establishment').style('Question');
    document.createParagraph(primaryEstablishment).style('body');

    document.createParagraph('Additional establishments').style('Question');
    const establishments = (values.establishments || [])
      .map(e => e.name || e['establishment-name'])
      .filter(e => e !== primaryEstablishment);
    const text = (values['other-establishments'] && establishments.length)
      ? establishments.join(', ')
      : 'None';
    document.createParagraph(text).style('body').pageBreak();

    sections.filter(s => !s.show || s.show(values)).forEach(section => {
      if (section.name === 'nts') {
        return renderNtsSection(document, section, values, sections);
      }
      renderSection(document, section, values);
    });
  };

  const traverse = (obj, fn) => {
    if (!obj || typeof obj !== 'object') {
      return Promise.resolve(obj);
    }

    const promises = Object.keys(obj).map(key => {
      const val = obj[key];

      // if we find an array, iterate it
      if (Array.isArray(val)) {
        return Promise.all(val.map(item => traverse(item, fn)));
      }

      return Promise.resolve()
        .then(() => fn(val))
        .then(transformed => { obj[key] = transformed; });
    });

    return Promise.all(promises).then(() => obj);
  };

  const addImageDimensions = values => {
    return traverse(values, (value) => {
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

      const nodePromises = value.document.nodes.map(node => {
        if (node.type !== 'image') {
          return Promise.resolve(node);
        }

        return updateImageDimensions(node);
      });

      return Promise.all(nodePromises)
        .then(nodes => {
          value.document.nodes = nodes;
          return Promise.resolve(valueWasJson ? JSON.stringify(value) : value);
        });
    });
  };

  return Promise.resolve()
    .then(() => addImageDimensions(values))
    .then(() => addStyles(document))
    .then(() => renderDocument(sections, values))
    .then(() => addPageNumbers(document))
    .then(() => document);
};
