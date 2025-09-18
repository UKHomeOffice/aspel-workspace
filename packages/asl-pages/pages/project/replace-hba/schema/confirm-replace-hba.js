const content = require('../confirm-replace-hba/content');
const { getFromContentTemplate } = require('../../../../lib/utils');

const buildOptions = (taskType) => ['yes', 'no'].map((value) => {
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

module.exports = (taskType) => {
  const options = buildOptions(taskType);
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
