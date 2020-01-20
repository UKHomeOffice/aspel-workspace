const { merge } = require('lodash');
const baseContent = require('@asl/pages/pages/establishment/licence-fees/content');

module.exports = merge({}, baseContent, {
  subtitle: 'All establishments',
  fees: {
    summary: {
      establishment: 'Establishment licences'
    },
    tabs: {
      establishments: 'All establishments'
    }
  }
});
