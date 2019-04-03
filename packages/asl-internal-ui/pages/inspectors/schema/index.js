const { merge } = require('lodash');
const { getInspectors } = require('../../common/helpers');

const schema = {
  inspector: {
    inputType: 'select',
    accessor: 'id',
    validate: ['required']
  }
};

const mapSchema = (profiles, schema) => {

  const options = profiles.map(({ firstName, lastName, id }) => ({
    label: `${firstName} ${lastName}`,
    value: id
  }));

  return merge({}, schema, {
    inspector: {
      options,
      validate: [
        ...schema.inspector.validate,
        {
          definedValues: options.map(option => option.value)
        }
      ]
    }
  });
};

const getSchemaWithInspectors = (req, schema) =>
  getInspectors(req)
    .then(inspectors => Promise.resolve(mapSchema(inspectors, schema)))
    .catch(err => Promise.reject(err));

module.exports = {
  schema,
  getSchemaWithInspectors
};
