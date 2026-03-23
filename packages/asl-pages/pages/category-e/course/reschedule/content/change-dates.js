const baseContent = require('./base');

const { merge } = require('lodash');

module.exports = merge({},
  baseContent,
  {
    pageTitle: 'Change course dates',
    pageSubtitle: '{{trainingCourse.title}}',
    buttons: {
      submit: 'Continue',
      cancel: 'Cancel'
    }
  }
);
