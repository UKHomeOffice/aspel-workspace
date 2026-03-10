const { merge } = require('lodash');
const baseContent = require('./base');

module.exports = merge(
  {},
  baseContent,
  {
    pageTitle: 'Select a project licence',
    bodyText: 'To add a course you need a project licence which is approved for' +
    ' higher education or training purposes.',
    projectPageLink: 'Apply for a project licence',
    fields: {
      id: { label: 'Select' },
      projectTitle: { label: 'Project title' },
      licenceNumber: { label: 'Licence number' },
      expiryDate: { label: 'Expiry date' },
      species: { label: 'Species' }
    },
    buttons: {
      submit: 'Continue',
      cancel: 'Cancel'
    }
  }
);
