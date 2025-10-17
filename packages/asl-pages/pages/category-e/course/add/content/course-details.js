const { merge } = require('lodash');
const baseContent = require('./base');

module.exports = merge(
  baseContent,
  {
    pageTitle: 'Add course details',
    buttons: {
      submit: 'Continue',
      cancel: 'Cancel'
    }
  }
);
