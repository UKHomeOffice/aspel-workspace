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
      label: 'Course start date',
      hint: 'For example 14 9 2023'
    },
    species: {
      label: 'Animals to be used for this course',
      hint: 'Select all that apply',
      checkAnswerLabel: 'Animals used'
    },
    coursePurpose: {
      label: 'Course Purpose',
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
      dateIsAfter: 'Course start date must be in the future.'
    },
    endDate: {
      required: 'Enter the course end date',
      validDate: 'Course end date must be a real date and include a day,' +
        ' month and year. The year must include 4 numbers',
      dateIsAfter: 'Course end date must be after the start date.',
      dateIsSameOrBefore: 'Course end date must be before the PPL expiry' +
        ' date {{ project.formattedExpiryDate }}'
    },
    species: {
      required: 'Select all animals to be used for this course'
    },
    projectId: {
      required: 'Select a project licence'
    }
  }
};
