const moment = require('moment');

module.exports = {
  dateRange: {
    inputType: 'inputDateRange',
    getValue: values => ({
      'date-from': values['date-from'],
      'date-to': values['date-to']
    }),
    validate: [{
      customValidate: (value, values) => {
        const start = moment(values['date-from'], ['YYYY-MM-DD', 'YYYY-M-D'], true);
        const end = moment(values['date-to'], ['YYYY-MM-DD', 'YYYY-M-D'], true);
        return !start.isValid() || !end.isValid() || !end.isAfter(start.add(6, 'months'), 'day');
      }
    }]
  },
  'date-from': {
    inputType: 'inputDate',
    dateLabel: "The 'From' date",
    validate: [
      'required',
      'validDate',
      { dateIsSameOrAfter: '2019-07-31' },
      { dateIsSameOrBefore: 'now' }
    ]
  },
  'date-to': {
    inputType: 'inputDate',
    dateLabel: "The 'To' date",
    validate: [
      'required',
      'validDate',
      { dateIsSameOrAfter: '2019-07-31' },
      { dateIsSameOrBefore: 'now' }
    ]
  },
  ra: {
    inputType: 'radioGroup',
    className: 'nts-ra-field',
    options: [true, false],
    format: value => value === 'true' ? true : value === 'false' ? false : value,
    validate: ['required', { definedValues: [true, false] }]
  }
};
