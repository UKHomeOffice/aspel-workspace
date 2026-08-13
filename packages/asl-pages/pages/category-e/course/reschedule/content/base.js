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
      // See course-details-form content: the GDS templates supply the
      // "must be a real date" / "must include ..." / "Year must include 4
      // numbers" wording the copy deck asks for.
      courseDate: {
        required: 'Enter a course date',
        dateIsAfter: 'Course date must be in the future',
        dateIsSameOrBefore: 'Course date must be the same as or before the PPL expiry' +
          ' date{{#project.formattedExpiryDate}} {{project.formattedExpiryDate}}{{/project.formattedExpiryDate}}'
      },
      startDate: {
        required: 'Enter a course start date',
        dateIsAfter: 'Course start date must be in the future'
      },
      endDate: {
        required: 'Enter a course end date',
        dateIsAfter: 'Course end date must be after the start date' +
          '{{#formattedStartDate}} {{formattedStartDate}}{{/formattedStartDate}}',
        dateIsSameOrBefore: 'Course end date must be the same as or before the PPL expiry' +
          ' date{{#project.formattedExpiryDate}} {{project.formattedExpiryDate}}{{/project.formattedExpiryDate}}'
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
