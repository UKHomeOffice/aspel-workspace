const dates = {
  dateRange: {
    inputType: 'inputDateRange',
    label: 'Filter by date granted',
    hint: 'You can only download data:\n\n- from 31 July 2019, when ASPeL came into use\n- for date ranges of 6 months or less',
    minDate: '2019-07-31',
    maxDate: 'now',
    minDateErrorCode: 'aspelDataStartDate'
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
