const { toArray } = require('@asl/pages/lib/utils');

module.exports = {
  authority: {
    inputType: 'checkboxGroup',
    options: [
      {
        label: 'Yes',
        value: true
      },
      {
        label: 'Not yet',
        value: false
      }
    ],
    nullValue: [],
    format: toArray,
    validate: [
      'required',
      {
        customValidate: field => field
      }
    ]
  }
};
