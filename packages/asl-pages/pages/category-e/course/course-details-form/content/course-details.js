const { merge } = require('lodash');
const baseContent = require('./base');

module.exports = merge(
  {},
  baseContent,
  {
    pageTitle: {
      add: 'Add course details',
      update: 'Change course details'
    },
    buttons: {
      submit: 'Continue',
      cancel: 'Cancel'
    }
  }
);
