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
    coursePurpose: {
      label: 'Course Purpose',
      options: coursePurposeOptions
    }
  }
};
