const baseContent = require('../../content');
const { merge } = require('lodash');

module.exports = merge({},
  baseContent,
  {
    fields: {
      courseDuration: {
        label: 'How long is the course?',
        options: {
          'one-day': 'One day',
          'multi-day': 'Longer than one day'
        },
        checkAnswerLabel: 'Course date{{#model.endDate}}s{{/model.endDate}}'
      },
      courseDate: {
        label: 'Course date',
        hint: 'For example 14 8 2023'
      },
      startDate: {
        label: 'Course start date',
        hint: 'For example 14 8 2023'
      },
      endDate: {
        label: 'Course end date',
        hint: 'For example 14 9 2023'
      }
    },
    errors: {
      courseDuration: {
        required: 'Select whether the course is one day or longer than one day'
      },
      courseDate: {
        required: 'Enter the course date',
        validDate: 'Course date must be a real date and include a day,' +
          ' month and year. The year must include 4 numbers',
        dateIsAfter: 'Course date must be in the future.',
        dateIsSameOrBefore: 'Course date must be before the PPL expiry' +
          ' date {{ project.formattedExpiryDate }}'
      },
      startDate: {
        required: 'Enter the course start date',
        validDate: 'Course start date must be a real date and include a day,' +
          ' month and year. The year must include 4 numbers',
        dateIsAfter: 'course start date must be in the future'
      },
      endDate: {
        required: 'Enter the course end date',
        validDate: 'Course end date must be a real date and include a day,' +
          ' month and year. The year must include 4 numbers',
        dateIsAfter: 'Course end date must be after the start date.',
        dateIsSameOrBefore: 'Course end date must be before the PPL expiry' +
          ' date {{ project.formattedExpiryDate }}'
      }
    },
    breadcrumbs: {
      categoryE: {
        course: {
          reschedule: 'Course date{{#model.endDate}}s{{/model.endDate}}'
        }
      }
    }
  }
);
