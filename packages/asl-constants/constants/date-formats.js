const DATE_FORMAT = {
  long: 'DD MMMM YYYY',
  medium: 'DD MMM YYYY',
  short: 'D/M/YYYY',
  shortYear: 'DD MMM YY',
  iso: 'YYYY-MM-DD',
  ordinalLong: 'Do MMMM YYYY',
  ordinalMonthYear: 'Do MMMM',
  ordinalDay: 'Do',
  year: 'YYYY',
  month: 'MMMM'
};

const STRICT_DATE_FORMATS = ['YYYY-MM-DD', 'YYYY-M-D'];

// ASPEL project start date - all historical data begins from this date
const ASPEL_DATA_START_DATE = '2019-07-31';

module.exports = {
  DATE_FORMAT,
  STRICT_DATE_FORMATS,
  ASPEL_DATA_START_DATE
};

