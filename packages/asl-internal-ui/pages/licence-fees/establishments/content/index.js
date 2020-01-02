const { merge } = require('lodash');
const baseContent = require('../../content');

module.exports = merge({}, baseContent, {
  title: 'Establishment overview',
  fields: {
    name: {
      label: 'Establishment name'
    },
    licenceNumber: {
      label: 'PEL number'
    },
    numberOfPils: {
      label: 'Number of PILs'
    },
    totalCost: {
      label: 'Cost of PILs'
    }
  }
});
