const baseContent = require('../../content');
const { trainingCoursePurpose } = require('@ukhomeoffice/asl-constants');
const { mapValues } = require('lodash');

const purposeHints = {
  higherEducation: 'For example a degree in pharmacology or physiology',
  training: 'For example to learn a new surgical procedure'
};

const coursePurposeOptions = mapValues(trainingCoursePurpose, (label, key) => ({
  label,
  hint: purposeHints[key]
}));

module.exports = {
  ...baseContent,
  fields: {
    projectId: { label: 'Select a project licence' },
    projectTitle: { label: 'Project title' },
    licenceNumber: { label: 'Project licence number' },
    expiryDate: { label: 'Project licence expiry date' },
    title: { label: 'Course title' },
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
    },
    species: {
      label: 'Animals to be used for this course',
      hint: 'Select all that apply',
      checkAnswerLabel: 'Animals used'
    },
    coursePurpose: {
      label: 'Is it a higher education or training course?',
      checkAnswerLabel: 'Course purpose',
      options: coursePurposeOptions
    }
  },
  errors: {
    title: {
      required: 'Enter a course title'
    },
    coursePurpose: {
      required: 'Select whether it\'s a higher education or training course'
    },
    courseDuration: {
      required: 'Select whether the course is one day or longer than one day'
    },
    // No `validDate` messages here: the copy deck asks for the GDS breakdown
    // ("Course date must be a real date", "... must include a day and month",
    // "Year must include 4 numbers"), which the generic templates build from
    // each field's `dateLabel`.
    courseDate: {
      required: 'Enter a course date',
      dateIsAfter: 'Course date must be in the future',
      // Wording follows the rule: `dateIsSameOrBefore` allows the expiry date itself.
      // The date is played back only when we have it, so we never trail a blank.
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
    },
    species: {
      required: 'Select all animals to be used for this course'
    },
    projectId: {
      required: 'Select a project licence'
    }
  }
};
