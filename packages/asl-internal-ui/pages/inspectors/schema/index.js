const { toArray } = require('@asl/pages/lib/utils');
const { getInspectors } = require('@asl/pages/pages/common/helpers');

const schema = {
  inspectors: {
    inputType: 'checkboxGroup',
    format: toArray,
    nullValue: []
  }
};

const mapSchema = inspectors => {
  const options = inspectors.map(({ firstName, lastName, id }) => ({
    label: `${firstName} ${lastName}`,
    value: id
  }));
  return {
    inspectors: {
      inputType: 'checkboxGroup',
      options,
      format: toArray,
      nullValue: []
    }
  };
};

const getSchemaWithInspectors = req =>
  getInspectors(req)
    .then(inspectors => Promise.resolve(mapSchema(inspectors)))
    .catch(err => Promise.reject(err));

module.exports = {
  schema,
  getSchemaWithInspectors
};
