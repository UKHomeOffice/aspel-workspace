const { merge } = require('lodash');
const { getInspectors, getSpocs } = require('../../common/helpers');

const schema = {
  asru: {
    inputType: 'select',
    accessor: 'id',
    validate: ['required']
  }
};

const mapSchema = (profiles, schema) => {
  const options = profiles.map(({ firstName, lastName, id }) => ({
    label: `${lastName}, ${firstName}`,
    value: id
  }));

  return merge({}, schema, {
    asru: {
      options,
      validate: [
        ...schema.asru.validate,
        {
          definedValues: options.map(option => option.value)
        }
      ]
    }
  });
};

const getSchemaWithInspectors = (req, schema) =>
  getInspectors(req)
    .then(asru => Promise.resolve(mapSchema(asru, schema)))
    .catch(err => Promise.reject(err));

const getSchemaWithSpocs = (req, schema) =>
  getSpocs(req)
    .then(asru => Promise.resolve(mapSchema(asru, schema)))
    .catch(err => Promise.reject(err));

module.exports = {
  schema,
  getSchemaWithInspectors,
  getSchemaWithSpocs
};
