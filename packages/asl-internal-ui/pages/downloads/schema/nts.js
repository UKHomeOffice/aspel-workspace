const dates = {
  dateRange: {
    inputType: 'inputDateRange',
    minDate: '2019-07-31',
    maxDate: 'now',
    minDateErrorCode: 'aspelDataStartDate'
  }
};

const ra = {
  ra: {
    inputType: 'radioGroup',
    className: 'nts-ra-field',
    options: [true, false],
    validate: ['required']
  }
};

module.exports = { dates, ra };
