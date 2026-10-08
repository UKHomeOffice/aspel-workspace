const { ASPEL_DATA_START_DATE } = require('@ukhomeoffice/asl-constants');
const { parseDate, formatDate, DATE_FORMAT } = require('@ukhomeoffice/asl-components/dayjs');

const aspelStartDate = parseDate(ASPEL_DATA_START_DATE);
const formattedDate = formatDate(aspelStartDate, DATE_FORMAT.long);

const dates = {
  dateRange: {
    inputType: 'inputDateRange',
    label: 'Filter by date granted',
    hint: `You can only download data from ${formattedDate}, when ASPeL came into use`,
    minDate: ASPEL_DATA_START_DATE,
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
