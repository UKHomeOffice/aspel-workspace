const baseContent = require('./base');

const { merge } = require('lodash');

module.exports = merge({},
  baseContent,
  {
    pageTitle: 'Change course date{{#model.endDate}}s{{/model.endDate}}',
    pageSubtitle: '{{trainingCourse.title}}',
    buttons: {
      submit: 'Continue',
      cancel: 'Cancel'
    }
  }
);
