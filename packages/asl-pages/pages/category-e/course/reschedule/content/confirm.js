const baseContent = require('./base');
const { merge } = require('lodash');

module.exports = merge({},
  baseContent,
  {
    pageTitle: 'Check date change',
    pageSubtitle: '{{trainingCourse.title}}',
    fields: {
      previousCourseDate: { label: 'Previous course date' },
      previousStartDate: { label: 'Previous start date' },
      previousEndDate: { label: 'Previous end date' },
      newCourseDate: { label: 'New course date' },
      newStartDate: { label: 'New start date' },
      newEndDate: { label: 'New end date' }
    },
    buttons: {
      change: 'Select different dates',
      submit: 'Confirm date change',
      cancel: 'Cancel'
    }
  }
);
