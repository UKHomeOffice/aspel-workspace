require('@asl/service/lib/register');

const { Value } = require('slate');
const { omit, flattenDeep } = require('lodash');
const { getSubsections } = require('@asl/projects/client/schema');

const schema = [
  getSubsections(0),
  getSubsections(1)
];

function getFieldValue(data, field) {
  let value = data[field.name];

  switch (field.type) {
    case 'text':
    case 'keywords':
      return value ? [value] : [];
    case 'texteditor': {
      if (!value) {
        return [];
      }
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          return [];
        }
      }

      try {
        const doc = Value.fromJSON(value || {}).document;
        return Array.from(doc.texts()).map(([t]) => t.text).filter(Boolean);
      } catch (err) {
        console.warn(`Failed to parse texteditor field "${field.name}"`, err.message);
        return [];
      }
    }

    default:
      if (field.options) {
        const revealed = field.options.find(opt => opt.value === value && opt.reveal);
        if (revealed) {
          const subfields = Array.isArray(revealed.reveal) ? revealed.reveal : [revealed.reveal];
          return subfields.map(f => getFieldValue(data, f));
        }
      }
      return [];
  }
}

function getProtocolsContent(data, sectionSchema) {
  const protocols = (data.protocols || []).filter(p => p && !p.deleted);
  if (!protocols.length) {
    return {};
  }

  return protocols.reduce((map, protocol, i) => {
    const combinedData = { ...data, ...protocol };
    const sectionValues = Object.values(sectionSchema.sections || {}).flatMap(sec =>
      getSectionContent(combinedData, sec)
    );

    const value = flattenDeep([protocol.title, ...sectionValues])
      .filter(Boolean)
      .join('\n\n');

    if (value) {
      map[i] = value;
    }
    return map;
  }, {});
}

function getSectionContent(data, section) {
  if (!section) return [];

  if (['protocol', 'protocols'].includes(section.name)) {
    return getProtocolsContent(data, section);
  }

  if (section.show && !section.show(data)) {
    return [];
  }

  if (section.steps) {
    return section.steps.flatMap(step => getSectionContent(data, step));
  }

  if (section.repeats === 'objectives') {
    return (data.objectives || []).flatMap(o => o.title || []);
  }

  if (section.repeats) {
    const repeatedData = data[section.repeats] || [];
    return repeatedData.flatMap(repeater =>
      getSectionContent({ ...data, ...repeater }, omit(section, 'repeats'))
    );
  }

  if (section.fields) {
    return section.fields.flatMap(field => getFieldValue(data, field));
  }

  return [];
}

module.exports = (data, { schemaVersion, id }) => {
  const sections = schema[schemaVersion];
  if (!sections) {
    console.error(`Unknown schema version ${schemaVersion} for project ${id}`);
    return {};
  }

  return Object.entries(sections).reduce((map, [key, section]) => {
    try {
      let content = getSectionContent(data, section);

      if (!content || (Array.isArray(content) && !content.length)) {
        return map;
      }

      if (key !== 'protocols') {
        content = flattenDeep(content).filter(Boolean).join('\n\n');
      }

      map[key] = content;
      return map;
    } catch (err) {
      console.error(`Error processing section "${key}" for project ${id}:`, err.message);
      return map;
    }
  }, {});

};
