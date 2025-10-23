const { merge } = require('lodash');

module.exports = merge({
  fields: {
    hbaFilename: { label: 'Selected HBA file:' },
    hbaReplacementReason: {
      label: 'Replacement reason',
      hint: 'why this replacement is needed?'
    },
    confirmHba: {
      label: 'What do you want to do?',
      options: {
        yes: 'Confirm and replace HBA file',
        no: 'Discard selected replacement file and choose another'
      }
    }
  },
  warning: 'Once confirmed, this HBA file in ASPeL (not SharePoint) will be the single point of reference for this licence, for future assessment and audit purposes.',
  buttons: {
    submit: 'Continue'
  },
  errors: {
    confirmHba: {
      required: 'Confirm or discard the selected HBA file',
      definedValues: 'Select from one of the provided options'
    }
  }
});
