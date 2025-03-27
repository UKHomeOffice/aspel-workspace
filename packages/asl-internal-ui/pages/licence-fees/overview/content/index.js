const { merge } = require('lodash');
const baseContent = require('../../content');

module.exports = merge({}, baseContent, {
  title: 'Licence fees overview',
  fees: {
    overview: {
      establishment: {
        title: 'Establishment licences',
        count: 'Number of establishment licences',
        fee: 'Cost per establishment licence',
        total: 'Total fees for establishment licences'
      },
      personal: {
        title: 'Personal licences',
        count: 'Number of personal licences held',
        countBillable: 'Number of billable personal licences held',
        fee: 'Cost per licence',
        total: 'Total fees for personal licences'
      },
      total: {
        title: 'Cost of all personal and establishment licences',
        fee: 'Total fees'
      }
    }
  }
});
