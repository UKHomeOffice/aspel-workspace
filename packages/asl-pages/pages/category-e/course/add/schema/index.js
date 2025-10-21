const { trainingCoursePurpose } = require('@ukhomeoffice/asl-constants');
const moment = require('moment');

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
  courseDuration: {
    page: 'course-details',
    inputType: 'radioGroup',
    automapReveals: true,
    options: [
      {
        value: 'one-day',
        reveal: {
          courseDate: {
            inputType: 'inputDate',
            show: true,
            validate: [
              'required',
              'validDate',
              { dateIsAfter: 'now' },
              { dateIsSameOrBefore: (_values, model) => moment(model?.project?.expiryDate) }
            ]
          }
        }
      },
      {
        value: 'multi-day',
        reveal: {
          startDate: {
            inputType: 'inputDate',
            show: true,
            validate: [
              'required',
              'validDate',
              { dateIsAfter: 'now' }
            ]
          },
          endDate: {
            inputType: 'inputDate',
            show: true,
            validate: [
              'required',
              'validDate',
              { dateIsAfter: (values) => values.startDate },
              { dateIsSameOrBefore: (_values, model) =>
                moment(model?.project?.expiryDate)
              }
            ]
          }
        }
      }
    ],
    validate: ['required']
  },
  species: {
    page: 'course-details',
    inputType: 'checkboxGroup',
    options: [/* Set dynamically from chosen project */],
    validate: ['required']
  }
};
