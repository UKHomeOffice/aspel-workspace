const { merge } = require('lodash');
const fields = require('./fields');
const baseContent = require('../../content');

module.exports = merge({}, {
  ...baseContent,
  fields,
  buttons: {
    cancel: 'Edit'
  }
});
