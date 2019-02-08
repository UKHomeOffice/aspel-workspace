import saveAs from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Numbering } from 'docx';
import { flatten, isUndefined } from 'lodash';
import SPECIES from '../client/constants/species';

const addStyles = doc => {
  doc.Styles.createParagraphStyle('Heading1', 'Heading 1')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(40)
    .bold()
    .font('Helvetica')
    .spacing({ before: 360, after: 360 });

  doc.Styles.createParagraphStyle('Heading2', 'Heading 2')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(32)
    .bold()
    .font('Helvetica')
    .spacing({ before: 360, after: 360 });

  doc.Styles.createParagraphStyle('Heading3', 'Heading 3')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(24)
    .bold()
    .font('Helvetica')
    .spacing({ before: 360, after: 360 });

  doc.Styles.createParagraphStyle('body', 'Body')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(24)
    .font('Helvetica')
    .spacing({ before: 360, after: 360 });

  doc.Styles.createParagraphStyle('aside', 'Aside')
    .basedOn('Body')
    .next('Body')
    .quickFormat()
    .size(24)
    .color('999999')
    .italics();

  return doc;
};

const renderTextEditor = (doc, value) => {
  const content = JSON.parse(value);
  const nodes = content.document.nodes;
  let text;

  nodes.map(node => {
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

        node.nodes.map(n => {
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
        node.nodes.map(n => {
          // TODO: the item may have marks
          text = new TextRun(n.nodes[0].leaves[0].text.trim()).size(24);
          const paragraph = new Paragraph();
          paragraph.style('body').bullet();
          paragraph.addRun(text);
          doc.addParagraph(paragraph);
        });
        break;

      case 'paragraph':
        node.nodes[0].leaves.map(leaf => {
          text = new TextRun(leaf.text.trim());
          if (text) {
            leaf.marks.forEach(mark => {
              switch (mark.type) {
                case 'bold':
                  text.bold();
                  break;

                case 'italic':
                  text.italic();
                  break;

                case 'underlined':
                  text.underline();
                  break;

                default:
                  return text;
              }
            });
            const paragraph = new Paragraph();
            paragraph.style('body');
            paragraph.addRun(text);
            doc.addParagraph(paragraph);
          }
        });
        break;

      case 'image':
        doc.createImage(node.data.src, node.data.width, node.data.height);
        break;

      default:
        break;
    }
  });
};

const renderRadio = (doc, field, values, value) => {
  let option;

  if (field.options) {
    option = field.options.find(o => o.value === value);
  }

  const label = option ? option.label : value;
  doc.createParagraph(label).style('body');

  if (option && option.reveal) {
    const reveals = !Array.isArray(option.reveal) ? [option.reveal] : option.reveal;

    reveals.map(reveal => {
      const revealValue = values[reveal.name];

      if (revealValue) {
        let text;
        let paragraph = new Paragraph();
        paragraph.style('body');
        doc.createParagraph(reveal.label).heading3();

        switch (reveal.type) {
          case 'radio':
          case 'checkbox':
          case 'species-selector':
            if (reveal.options) {
              let revealOption = reveal.options.find(r => r.value === revealValue);
              if(revealOption) {
                text = new TextRun(revealOption.label);
              }
            } else {
              revealValue.map(v => {
                text = new TextRun(v);
                paragraph.bullet();
              });
            }
            paragraph.addRun(text);
            doc.addParagraph(paragraph);
            break;

          case 'texteditor':
            renderTextEditor(doc, revealValue);
            break;

          default:
            break;
        }
      }
    });
  }
};

const renderSpeciesSelector = (doc, values, value) => {
  value.map(specie => {
    let text = new TextRun(
      flatten(Object.values(SPECIES)).find(s => s.value === specie).label
    ).size(24);

    const paragraph = new Paragraph();
    paragraph.style('body').bullet();
    paragraph.addRun(text);
    doc.addParagraph(paragraph);
  });

  const otherSpecies = values['species-other'];

  if (otherSpecies) {
    otherSpecies.map(s => {
      let text = new TextRun(s).size(24);
      const paragraph = new Paragraph();
      paragraph.style('body').bullet();
      paragraph.addRun(text);
      doc.addParagraph(paragraph);
    });
  }
};

const renderSelector = (doc, value) => {
  value.map(item => {
    let text = new TextRun(item).size(24);
    const paragraph = new Paragraph();
    paragraph.style('body').bullet();
    paragraph.addRun(text);
    doc.addParagraph(paragraph);
  });
};

const renderText = (doc, value) => {
  if (typeof value === 'boolean') {
    value
      ? doc.createParagraph('Yes').style('body')
      : doc.createParagraph('No').style('body');
  } else {
    doc.createParagraph(value).style('body');
  }
};

const renderDuration = (doc, value) => {
  let years = value.years > 1 ? 'Years' : 'Year';
  let months = value.months > 1 ? 'Months' : 'Month';
  doc.createParagraph(`${value.years} ${years} ${value.months} ${months}`).style('body');
};

const renderField = (doc, field, values) => {
  const value = values[field.name];
  doc.createParagraph(field.label).heading3();

  if (isUndefined(value)) {
    const paragraph = new Paragraph();
    paragraph.style('body');
    paragraph.addRun(new TextRun('No answer provided').italic());
    doc.addParagraph(paragraph);
    return;
  }

  switch (field.type) {
    case 'radio':
      renderRadio(doc, field, values, value);
      break;

    case 'species-selector':
      renderSpeciesSelector(doc, values, value);
      break;

    case 'location-selector':
    case 'objective-selector':
    case 'checkbox':
      renderSelector(doc, value);
      break;

    case 'text':
    case 'textarea':
      renderText(doc, value);
      break;

    case 'duration':
      renderDuration(doc, value);
      break;

    case 'texteditor':
      renderTextEditor(doc, value);
      break;
  }
};

const renderFields = (doc, subsection, values) => {
  const fields = (subsection.steps) ? subsection.steps : [{ 'fields': subsection.fields }];

  fields.map(step => {
    if (step.name === 'polesList' || step.name === 'establishments' || step.name === 'objectives') {
      (values[step.name] || []).map(v => {
        step.fields.map(field => renderField(doc, field, v));
      });
    } else {
      step.fields.map(field => renderField(doc, field, values));
    }
  });
}

const renderProtocol = (doc, protocolSection, protocolValues) => {
  doc.createParagraph(protocolSection.title).heading2();

  if (protocolSection.name === 'protocolSteps') {
    protocolValues.steps.map(stepValues => {
      renderFields(doc, protocolSection, stepValues);
    });
  } else if (protocolSection.name === 'protocolExperience') {
    Object.values(protocolSection)
      .filter((e) => { return e instanceof Object; })
      .map(s => {
        renderFields(doc, s, protocolValues);
      });
  } else {
    renderFields(doc, protocolSection, protocolValues);
  }
};

const renderProtocolsSection = (doc, subsection, values) => {
  renderFields(doc, subsection.setup, values);

  (values['protocols'] || []).map(protocolValues => {
    renderField(doc, subsection.fields[0], protocolValues);

    Object.values(subsection.sections).map(
      protocolSection => renderProtocol(doc, protocolSection, protocolValues)
    );
  });
};

const renderSubsection = (doc, subsection, values) => {
  doc.createParagraph(subsection.title).heading2();

  if(subsection.name === 'protocols') {
    renderProtocolsSection(doc, subsection, values);
  } else {
    renderFields(doc, subsection, values);
  }
};

const renderSection = (doc, section, values) => {
  Object.values(section.subsections).map(
    subsection => renderSubsection(doc, subsection, values)
  );
};

const render = (doc, sections, values) => {
  doc.createParagraph(values.title).heading1();

  sections = sections.filter(s => s.name !== 'nts');

  sections.map(section => {
    renderSection(doc, section, values);
  });

  return doc;
};

const pack = (doc, filename) => {
  const packer = new Packer();

  packer.toBlob(doc).then(blob => {
    saveAs(blob, filename);
  });
};

const traverse = (obj, fn) => {
  if (typeof obj !== 'object') {
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
      .then(transformed => obj[key] = transformed);
  });

  return Promise.all(promises).then(() => obj);
};

const addImageDimensions = values => {
  return traverse(values, (value) => {
    if (typeof value !== 'string') {
      return Promise.resolve(value);
    }

    try {
      const content = JSON.parse(value);

      if (!content.document || !content.document.nodes) {
        return Promise.resolve(value);
      }

      const nodePromises = content.document.nodes.map(node => {
        if (node.type !== 'image') {
          return Promise.resolve(node);
        }

        return new Promise(resolve => {
          const image = new Image();
          image.src = node.data.src;

          image.onload = () => {
            node.data.width = image.naturalWidth;
            node.data.height = image.naturalHeight;
            resolve(node);
          };
        });
      });

      return Promise.all(nodePromises)
        .then(nodes => {
          content.document.nodes = nodes;
          return JSON.stringify(content);
        });
    } catch (e) {
      // not json, do nothing
      return Promise.resolve(value);
    }
  });
};

module.exports = {
  generate: ({sections, values}) => {
    return Promise.resolve()
      .then(() => addImageDimensions(values))
      .then(() => new Document())
      .then(doc => addStyles(doc))
      .then(doc => render(doc, sections, values))
      .then(doc => pack(doc, values.title));
  }
};
