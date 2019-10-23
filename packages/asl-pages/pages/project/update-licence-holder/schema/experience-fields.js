const { get, flattenDeep, castArray } = require('lodash');
const schema = require('@asl/projects/client/schema/v1/experience').default;

const fieldNames = flattenDeep(schema.fields.map(field => {
  return [
    field.name,
    ...(field.options || []).filter(opt => opt.reveal).map(opt => castArray(opt.reveal).map(f => f.name))
  ];
}));

module.exports = {
  fields,
  fieldNames
};
