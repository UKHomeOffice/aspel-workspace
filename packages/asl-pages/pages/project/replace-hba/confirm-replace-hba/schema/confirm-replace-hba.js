const content = require('../content');
const { getFromContentTemplate } = require('../../../../../lib/utils');

const buildOptions = () => ['yes', 'no'].map((value) => {
  return {
    value,
    label: getFromContentTemplate(
      content,
      [
        `fields.confirmHba.options.${value}`,
        `fields.confirmHba.options.${value}`
      ]
    )
  };
});

module.exports = () => {
  const options = buildOptions();
  const schema = {
    confirmHba: {
      inputType: 'radioGroup',
      options,
      nullValue: [],
      validate: [
        'required',
        {
          definedValues: options.map((option) => option.value)
        }
      ]
    }
  };

  return schema;
};
