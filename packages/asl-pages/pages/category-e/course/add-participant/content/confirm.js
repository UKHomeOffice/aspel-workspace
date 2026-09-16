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
      submit:
        '{{#canEndorseParticipant }}Confirm details{{/canEndorseParticipant}}' +
        '{{^canEndorseParticipant }}Send for endorsement{{/canEndorseParticipant}}',
      cancel: 'Cancel'
    },
    notifications: {
      success: 'Licence request sent.'
    }
  }
);
