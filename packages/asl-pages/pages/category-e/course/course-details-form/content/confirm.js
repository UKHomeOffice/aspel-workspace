const { merge } = require('lodash');
const baseContent = require('./base');

module.exports = merge(
  {},
  baseContent,
  {
    pageTitle: 'Check course details',
    buttons: {
      submit: '{{^trainingCourseId}}Submit new course{{/trainingCourseId}}{{#trainingCourseId}}Save changes{{/trainingCourseId}}',
      cancel: 'Cancel'
    }
  }
);
