import { Document, Paragraph, TextRun, Table, Numbering, Indent, Media } from 'docx';
import unified from 'unified';
import remarkParse from 'remark-parse';
import get from 'lodash/get';
import uniq from 'lodash/uniq';
import concat from 'lodash/concat';
import flatten from 'lodash/flatten';
import values from 'lodash/values';
import Mustache from 'mustache';
import { projectSpecies as SPECIES } from '@ukhomeoffice/asl-constants';
import RAContent from '@asl/projects/client/constants/retrospective-assessment';
import schemaVersions from '@asl/projects/client/schema';
import schemaV0 from '@asl/projects/client/schema/v0';
import schemaV1 from '@asl/projects/client/schema/v1';
import schemaV1Purpose from '@asl/projects/client/schema/v1/permissible-purpose';

export default async function ntsDocxRenderer(opts) {
  const {
    application,
    version,
    ntsSections,
    includeDraftRa,
    ra,
    raReasons,
    isTrainingLicence
  } = opts;

  const document = new Document();

  const addStyles = () => {
    document.Styles.createParagraphStyle('Question', 'Question')
      .basedOn('Normal').next('Normal').quickFormat()
      .size(24).indent(800).bold().color('#3B3B3B').font('Helvetica')
      .spacing({ before: 200, after: 50 });

    document.Styles.createParagraphStyle('SectionTitle', 'Section Title')
      .basedOn('Normal').next('Normal').quickFormat()
      .size(44).bold().color('#8F23B3').font('Helvetica')
      .spacing({ before: 500, after: 300 });

    document.Styles.createParagraphStyle('Heading1', 'Heading 1')
      .basedOn('Normal').next('Normal').quickFormat()
      .size(52).bold().font('Helvetica')
      .spacing({ before: 360, after: 400 });

    document.Styles.createParagraphStyle('Heading2', 'Heading 2')
      .basedOn('Normal').next('Normal').quickFormat()
      .size(44).bold().font('Helvetica')
      .spacing({ before: 400, after: 300 });

    document.Styles.createParagraphStyle('Heading3', 'Heading 3')
      .basedOn('Normal').next('Normal').quickFormat()
      .size(36).bold().font('Helvetica')
      .spacing({ before: 400, after: 200 });

    document.Styles.createParagraphStyle('body', 'Body')
      .basedOn('Normal').next('Normal').quickFormat()
      .size(24).font('Helvetica')
      .spacing({ before: 200, after: 200 });

    document.Styles.createParagraphStyle('aside', 'Aside')
      .basedOn('Body').next('Body').quickFormat()
      .size(24).color('999999').italics();
  };

  const renderHorizontalRule = () => {
    document.createParagraph('___________________________________________________________________');
  };

  const renderMarkdown = (markdown, style = 'body') => {
    const tree = unified().use(remarkParse).parse(markdown);

    (tree.children || []).forEach(node => {
      switch (node.type) {
        case 'heading': {
          const text = node.children.find(c => c.type === 'text')?.value || '';
          document.createParagraph(text).style(`Heading${node.depth}`);
          break;
        }
        case 'paragraph': {
          const text = node.children.find(c => c.type === 'text')?.value || '';
          document.createParagraph(text).style(style);
          break;
        }
        case 'list': {
          node.children.forEach(listItem => {
            const text = get(listItem, 'children[0].children[0].value', '').trim();
            const p = new Paragraph(text);
            p.style(style);
            p.bullet(0);
            document.addParagraph(p);
          });
          break;
        }
      }
    });
  };

  const numbering = new Numbering();
  const abstract = numbering.createAbstractNumbering();

  const renderNode = (parent, node, depth = 0, paragraph, numbers, index) => {
    let text;
    let p;
    let addToDoc;

    const getContent = input => {
      return get(input, 'nodes[0].leaves[0].text', get(input, 'nodes[0].text', '')).trim();
    };

    switch (node.type) {
      case 'list-item':
        p = new Paragraph();
        p.style('body');
        numbers
          ? p.setNumbering(numbers, depth)
          : p.bullet(depth);
        parent.addParagraph(p);
        node.nodes.forEach((n, idx) => renderNode(parent, n, depth + 1, p, null, idx));
        break;

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
      case 'block':
        if (node.nodes && node.nodes.length === 1 && !getContent(node)) {
          return;
        }
        addToDoc = !paragraph;
        paragraph = paragraph || new Paragraph();
        (node.nodes || []).forEach((childNode, childNodeIndex) => {
          const leaves = childNode.leaves || [childNode];
          leaves.forEach(leaf => {
            text = new TextRun(String(leaf.text || ''));
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
            if (!addToDoc && (index > 0) && childNodeIndex === 0) {
              text.break().break();
            }
            paragraph.style('body');
            paragraph.addRun(text);
          });
        });
        if (addToDoc) {
          parent.addParagraph(paragraph);
        }
        break;

      case 'numbered-list': {
        abstract.createLevel(depth, 'decimal', '%2.', 'start').addParagraphProperty(new Indent(720 * (depth + 1), 0));
        const concrete = numbering.createConcreteNumbering(abstract);
        (node.nodes || []).forEach(item => renderNode(parent, item, depth, paragraph, concrete));
        break;
      }

      case 'bulleted-list':
        (node.nodes || []).forEach(item => renderNode(parent, item, depth, paragraph));
        break;

      case 'image':
        // images in NTS Slate content not yet supported in DOCX
        break;

      default:
        if (node.text) {
          renderNode(parent, { object: 'block', type: 'paragraph', nodes: [ node ] }, depth, paragraph);
        }
    }
  };

  const renderTextEditor = (value) => {
    let content = value;
    if (typeof value === 'string') {
      try {
        content = JSON.parse(value);
      } catch (e) {
        return renderText(value);
      }
    }
    const nodes = get(content, 'document.nodes', []);
    nodes.forEach(node => {
      try {
        renderNode(document, node);
      } catch (e) {
        document.createParagraph('There was a problem rendering this content').style('aside');
      }
    });
    renderHorizontalRule();
  };

  const renderTitleBlock = () => {
    document.createParagraph('Non-technical Summary').heading1();
    document.createParagraph(application.title || version.title || 'Untitled project').heading2();
    document.createParagraph('\n').style('body');
  };

  const renderLabel = (text) => {
    if (!text) { return; }
    document.createParagraph(text).style('Question');
  };

  const renderText = (value) => {
    if (typeof value === 'boolean') {
      document.createParagraph(value ? 'Yes' : 'No').style('body');
    } else if (value == null || value === '') {
      const p = new Paragraph();
      p.style('body');
      p.addRun(new TextRun('No answer provided').italics());
      document.addParagraph(p);
    } else {
      document.createParagraph(String(value)).style('body');
    }
    renderHorizontalRule();
  };

  const renderDuration = () => {
    const value = version['duration'] || {};
    let months = get(value, 'months');
    let years = get(value, 'years');
    months = Number.isInteger(months) ? months : 0;
    years = Number.isInteger(years) ? years : 5;
    if (months > 12) { months = 0; }
    if (years >= 5 || (!months && !years)) { years = 5; months = 0; }
    document.createParagraph(`${years} years ${months} months`).style('body');
    renderHorizontalRule();
  };

  const renderKeywords = () => {
    const list = version.keywords || [];
    if (!list.length) {
      const p = new Paragraph();
      p.style('body');
      p.addRun(new TextRun('No answer provided').italics());
      document.addParagraph(p);
    } else {
      document.createParagraph(list.join(', ')).style('body');
    }
    renderHorizontalRule();
  };

  const renderPurpose = (schemaVersion) => {
    if (version['training-licence']) {
      const p = new Paragraph();
      p.style('body').bullet();
      p.addRun(new TextRun('(f) Higher education and training'));
      document.addParagraph(p);
      renderHorizontalRule();
      return;
    }
    const purposeOptions = schemaVersion === 0
      ? schemaV0().programmeOfWork.subsections.purpose.fields.find(f => f.name === 'purpose').options
      : schemaV1Purpose.options;
    const valuesSelected = schemaVersion === 0 ? version.purpose : version['permissible-purpose'];
    const selected = [].concat(valuesSelected || []);
    if (!selected.length) { return renderText(null); }
    selected.forEach(val => {
      const opt = purposeOptions.find(o => o.value === val);
      const p = new Paragraph();
      p.style('body').bullet();
      p.addRun(new TextRun(opt ? opt.label : String(val)));
      document.addParagraph(p);
    });
    renderHorizontalRule();
  };

  const speciesLabels = flatten(values(SPECIES));
  const getSpeciesLabel = speciesKey => {
    const species = speciesLabels.find(s => s.value === speciesKey);
    return species ? species.label : speciesKey;
  };
  const getSpeciesCount = (speciesKey) => version[`reduction-quantities-${speciesKey}`] || 'No answer provided';

  const renderSpeciesCount = () => {
    const speciesUsed = concat([], version.species, version['species-other']).filter(Boolean);
    if (!speciesUsed.length) { return renderText(null); }
    const renderItem = (speciesKey, depth = 0) => {
      if (speciesKey.startsWith('other-')) {
        const sub = version[`species-${speciesKey}`] || [];
        if (!sub.length) { return; }
        const p = new Paragraph(); p.style('body'); p.bullet(depth);
        p.addRun(new TextRun(getSpeciesLabel(speciesKey)));
        document.addParagraph(p);
        sub.forEach(s => renderItem(s, depth + 1));
      } else {
        const p = new Paragraph(); p.style('body'); p.bullet(depth);
        p.addRun(new TextRun(`${getSpeciesLabel(speciesKey)}: ${getSpeciesCount(speciesKey)}`));
        document.addParagraph(p);
      }
    };
    speciesUsed.forEach(s => renderItem(s));
    renderHorizontalRule();
  };

  const lifeStageOptions = schemaV1().protocols.subsections.protocols.sections.animals.fields.find(f => f.name === 'life-stages').options;
  const groupSpeciesDetails = () => {
    return (version.protocols || []).reduce((species, protocol) => {
      const activeDetails = (protocol?.species ?? [])
        .map(speciesKey => protocol?.speciesDetails?.find(d => (d.value ?? d.name) === speciesKey))
        .filter(Boolean)
        .map(details => ({...details, value: details.value ?? details.name}))
        .filter(Boolean);
      activeDetails.forEach(details => {
        const existing = species.find(s => s.value === details.value);
        const max = parseInt(details['maximum-animals'], 10);
        const stages = details['life-stages'] || [];
        if (existing) {
          existing.maximumAnimals += max;
          existing.lifeStages = uniq(concat(existing.lifeStages, stages));
        } else {
          species.push({ value: details.value, name: details.name, lifeStages: stages, maximumAnimals: max });
        }
      });
      return species;
    }, []).map(({ lifeStages, ...rest }) => ({
      ...rest,
      lifeStages: lifeStageOptions.filter(({ value }) => lifeStages.includes(value)).map(({ label }) => label)
    }));
  };

  const renderSpeciesTable = () => {
    const speciesDetails = groupSpeciesDetails();
    if (!speciesDetails.length) { return renderText(null); }
    const table = new Table({ rows: speciesDetails.length + 1, columns: 2, columnWidths: ['8000', '8000'] });
    // headers
    table.getCell(0, 0).addParagraph(new Paragraph('Animal types'));
    table.getCell(0, 1).addParagraph(new Paragraph('Life stages'));
    speciesDetails.forEach((s, i) => {
      table.getCell(i + 1, 0).addParagraph(new Paragraph(s.name));
      table.getCell(i + 1, 1).addParagraph(new Paragraph((s.lifeStages || []).join(', ')));
    });
    document.addTable(table);
    renderHorizontalRule();
  };

  const renderRetrospectiveDecision = () => {
    const raCompulsory = version.raCompulsory;
    const raRequired = !!version.retrospectiveAssessment;
    const isRequired = raCompulsory || raRequired || application.raDate;
    const text = isRequired ? RAContent.required : RAContent.notRequired;
    document.createParagraph(text).style('body');
    if (isRequired && raReasons && raReasons.length) {
      document.createParagraph('Reason for retrospective assessment').heading3();
      document.createParagraph('This may include reasons from previous versions of this licence.').style('aside');
      raReasons.forEach(reason => {
        const p = new Paragraph(); p.style('body').bullet();
        p.addRun(new TextRun(reason));
        document.addParagraph(p);
      });
    }
    renderHorizontalRule();
  };

  const renderRetrospectivePlaceholder = (field) => {
    const raCompulsory = version.raCompulsory;
    const raRequired = !!version.retrospectiveAssessment;
    const isRequired = raCompulsory || raRequired || application.raDate;
    if (!isRequired) { return; }
    const hasRaDate = !!application.raDate;
    const raDate = hasRaDate ? application.raDate : null;
    const content = Mustache.render(field.content, { raDate, hasRaDate });
    renderMarkdown(content, 'aside');
    renderHorizontalRule();
  };

  const renderRaSummary = (fieldNames) => {
    if (!ra) { return; }
    document.createParagraph('Retrospective assessment').heading2();
    if (application.raGrantedDate) {
      document.createParagraph(`Published: ${application.raGrantedDate}`).style('body');
    }
    const raSchema = schemaVersions['RA']();
    const allFields = flatten(Object.values(raSchema.introduction.subsections).map(s => s.fields));
    fieldNames.forEach(name => {
      const field = allFields.find(f => f.name === name);
      if (!field) { return; }
      document.createParagraph(field.label).heading3();
      const val = get(ra, ['data', field.name]);
      renderText(val);
    });
  };

  const renderField = (field, schemaVersion) => {
    if (field.heading) {
      if (field.heading === 'Retrospective assessment') {
        document.createParagraph(field.heading).heading2();
      } else {
        document.createParagraph(field.heading).heading3();
      }
    }
    if (field.label && field.name !== 'species') {
      renderLabel(field.label);
    }
    // Conditionally render components matching PDF NTS
    switch (field.type) {
      case 'Duration':
        return renderDuration();
      case 'SpeciesTable':
        return renderSpeciesTable();
      case 'SpeciesCount':
        return renderSpeciesCount();
      case 'FateOfAnimals':
        return renderText(get(version, 'fate-of-animals'));
      case 'Purpose':
        return renderPurpose(schemaVersion);
      case 'Keywords':
        return renderKeywords();
      case 'RetrospectiveDecision':
        return renderRetrospectiveDecision();
      case 'RetrospectivePlaceholder':
        // only show placeholder text when RA is required
        return renderRetrospectivePlaceholder(field);
      case 'radio': {
        const value = version[field.name];
        if (value == null) { return renderText(null); }
        const opt = (field.options || []).find(o => o.value === value);
        return renderText(opt ? opt.label : value);
      }
      default: {
        const value = version[field.name];
        return renderTextEditor(value);
      }
    }
  };

  const renderSection = (section, sectionIndex, schemaVersion) => {
    if (sectionIndex !== 0) {
      document.createParagraph(section.title).heading2();
    }
    if (section.subtitle) {
      document.createParagraph(section.subtitle).heading3();
    }
    const fields = (section.fields || []).filter(f => isTrainingLicence ? f.training !== false : f.training !== true);
    fields.forEach(field => renderField(field, schemaVersion));
  };

  const renderDocument = () => {
    renderTitleBlock();
    const schemaVersion = application.schemaVersion;
    Object.keys(ntsSections).forEach((sectionName, sectionIndex) => {
      renderSection(ntsSections[sectionName], sectionIndex, schemaVersion);
      const fields = ntsSections[sectionName].fields || [];
      fields.filter(f => f.raSummary).forEach(f => renderRaSummary(f.raSummary));
    });
  };

  addStyles();
  renderDocument();
  return document;
}
