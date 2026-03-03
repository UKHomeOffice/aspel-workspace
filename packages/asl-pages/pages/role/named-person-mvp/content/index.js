const { merge } = require('lodash');
const baseContent = require('./index');

module.exports = merge({}, baseContent, {
  breadcrumbs: {
    role: {
      namedPersonMvp: {
        index: 'Create'
      }
    }
  }
});
