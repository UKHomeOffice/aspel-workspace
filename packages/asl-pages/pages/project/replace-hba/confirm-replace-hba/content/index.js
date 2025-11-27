const { merge } = require('lodash');

module.exports = merge({
  fields: {
    hbaFilename: { label: 'Selected HBA file:' },
    hbaReplacementReason: {
      label: 'Reason for replacing file'
    },
    confirmHbaDeclaration: {
      label: ''
    }
  },
  warning: 'Once confirmed, this HBA file in ASPeL (not SharePoint) will be the single point of reference for this licence, for future assessment and audit purposes.',
  buttons: {
    submit: 'Confirm file replacement'
  },
  changeHba: 'Select a different file',
  errors: {
    confirmHbaDeclaration: {
      required: 'Select the checkbox to confirm you have the consent of the inspector who assessed this application'
    },
    hbaReplacementReason: {
      required: 'Give a reason for replacing the file'
    }
  }
});
