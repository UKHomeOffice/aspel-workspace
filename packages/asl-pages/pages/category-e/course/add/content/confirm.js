const { merge } = require('lodash');
const baseContent = require('./base');

module.exports = merge(
  {},
  baseContent,
  {
    pageTitle: 'Check course details',
    buttons: {
      submit: 'Submit new course',
      cancel: 'Cancel'
    }
  }
);
