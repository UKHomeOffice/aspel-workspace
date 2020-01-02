const { merge } = require('lodash');
const baseContent = require('@asl/pages/pages/establishment/licence-fees/content');

module.exports = merge({}, baseContent, {
  subtitle: 'All establishments',
  fees: {
    tabs: {
      establishments: 'All establishments',
      personal: 'All billable licences'
    }
  }
});
