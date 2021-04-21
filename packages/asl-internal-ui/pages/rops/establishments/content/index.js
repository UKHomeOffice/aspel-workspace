const common = require('../../content');

module.exports = {
  ...common,
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
    }
  }
};
