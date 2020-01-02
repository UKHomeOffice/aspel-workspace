const { merge } = require('lodash');
const baseContent = require('../../content');

module.exports = merge({}, baseContent, {
  title: 'Billable personal licences',
  fields: {
    licenceHolder: {
      label: 'PIL holder'
    },
    licenceNumber: {
      label: 'PIL number'
    },
    establishment: {
      label: 'Establishment'
    },
    issueDate: {
      label: 'Start date'
    },
    revocationDate: {
      label: 'End date'
    }
  }
});
