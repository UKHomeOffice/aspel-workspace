const { merge } = require('lodash');
const common = require('../../content');

module.exports = merge({}, common, {
  fields: {
    name: {
      label: 'Establishment name'
    },
    ropsDue: {
      label: 'Returns due'
    },
    ropsSubmitted: {
      label: 'Returns submitted'
    },
    ropsOutstanding: {
      label: 'Returns outstanding'
    },
    ropsOverdue: {
      label: 'Returns overdue'
    }
  }
});
