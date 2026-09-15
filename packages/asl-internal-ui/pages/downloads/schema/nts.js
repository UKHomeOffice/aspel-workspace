const dates = {
  dateRange: {
    inputType: 'inputDateRange',
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
    label: 'Which type of non-technical summary do you want to download? (docx file)',
    labelAsLegend: true,
    options: [
      {
        label: 'Projects requiring a retrospective assessment (RA)',
        value: 'true'
      },
      {
        label: 'Projects not requiring an RA',
        value: 'false'
      }
    ],
    validate: ['required']
  }
};

module.exports = { dates, ra };
