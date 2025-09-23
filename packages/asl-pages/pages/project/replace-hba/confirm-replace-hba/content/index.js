const { merge } = require('lodash');
const baseContent = require('../../../content');
module.exports = merge({}, baseContent, {
  fields: {
    hbaFilename: {
      label: 'Selected HBA file:'
    },
    confirmHba: {
      label: 'What do you want to do?',
      options: {
        yes: {
          label: 'Confirm and replace HBA file'
        },
        no: {
          label: 'Discard selected replacement file and choose another'
        }
      }
    }
  },
  warning: {
    amendment: 'Once confirmed, this HBA file in ASPeL (not SharePoint) will be the single point of reference for this licence, for future assessment and audit purposes.'
  },
  buttons: {
    submit: 'Continue'
  },
  errors: {
    confirmHba: {
      required: 'Confirm or discard the selected HBA file'
    }
  }
});
