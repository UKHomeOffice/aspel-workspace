const { trainingCoursePurpose } = require('@ukhomeoffice/asl-constants');

module.exports = {
  projectId: {
    page: 'select-licence',
    inputType: 'radioGroup',
    labelAsLegend: true,
    validate: [
      'required'
    ]
  },
  title: {
    page: 'course-details',
    inputType: 'inputText',
    show: true,
    validate: [
      'required'
    ]
  },
  coursePurpose: {
    page: 'course-details',
    inputType: 'radioGroup',
    options: [...Object.keys(trainingCoursePurpose)],
    validate: ['required']
  },
  startDate: {
    page: 'course-details',
    inputType: 'inputDate',
    show: true,
    validate: [
      'required',
      'validDate',
      { dateIsAfter: 'now' }
    ]
  },
  species: {
    page: 'course-details',
    inputType: 'speciesSelector',
    format: JSON.parse,
    validate: [
      'required'
    ]
  }
};
