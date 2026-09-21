const dates = {
  dateRange: {
    inputType: 'inputDateRange',
    label: 'Filter by date granted',
    hint: 'You can only download data from 31 July 2019, when ASPeL came into use',
    fieldNames: {
      from: 'startDate',
      to: 'endDate'
    },
    fields: {
      from: {
        label: 'Date from',
        hint: 'For example 01 01 2020'
      },
      to: {
        label: 'Date to',
        hint: 'For example 12 12 2020'
      }
    }
  }
};

const ra = {
  ra: {
    inputType: 'radioGroup',
    className: 'nts-ra-field',
    label: 'Which type of non-technical summary do you want to download? (docx file)',
    options: [
      {
        label: 'Projects requiring a retrospective assessment (RA)',
        value: true
      },
      {
        label: 'Projects not requiring an RA',
        value: false
      }
    ],
    validate: ['required']
  }
};

module.exports = { dates, ra };
