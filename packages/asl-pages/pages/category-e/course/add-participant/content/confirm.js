const { merge } = require('lodash');
const baseContent = require('./base');

module.exports = merge(
  {},
  baseContent,
  {
    title: 'Check participant details',
    fields: {
      title: {
        label: 'Course title'
      }
    },
    courseDetailsSummary: 'Course details',
    buttons: {
      change: 'Change participant details',
      submit: 'Send for endorsement',
      cancel: 'Cancel'
    },
    notifications: {
      success: 'Licence request sent.'
    }
  }
);
