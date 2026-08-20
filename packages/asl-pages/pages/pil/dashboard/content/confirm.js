const { merge } = require('lodash');
const baseContent = require('./index');

module.exports = merge({}, baseContent, {
  pageTitle: 'Check personal licence details',
  fields: {
    comment: {
      label: 'Remarks (optional)',
      hint: 'Your remarks will be recorded and visible to relevant establishment and Home Office personnel.'
    }
  },
  buttons: {
    submit: 'Submit to NTCO',
    submitAsLicensing: 'Update licence',
    submitAsAsru: 'Submit to licensing'
  }
});
