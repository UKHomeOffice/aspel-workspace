const { trainingCoursePurpose } = require('@ukhomeoffice/asl-constants');
const moment = require('moment');
const castArray = require('lodash/castArray');

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
            dateLabel: 'Course date',
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
            dateLabel: 'Course start date',
            show: true,
            validate: [
              'required',
              'validDate',
              { dateIsAfter: 'now' }
            ]
          },
          endDate: {
            inputType: 'inputDate',
            dateLabel: 'Course end date',
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
    validate: ['required'],
    format: val => castArray(val ?? [])
  }
};
