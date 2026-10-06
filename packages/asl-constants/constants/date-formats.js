const DATE_FORMAT = {
  long: 'DD MMMM YYYY',
  medium: 'D MMM YYYY',
  short: 'D/M/YYYY',
  shortPadded: 'DD/MM/YYYY',
  iso: 'YYYY-MM-DD',
  datetime: 'D MMMM YYYY h:mm',
  datetimeLong: 'DD MMMM YYYY h:mm'
};

const STRICT_DATE_FORMATS = ['YYYY-MM-DD', 'YYYY-M-D'];

// ASPEL project start date - all historical data begins from this date
const ASPEL_DATA_START_DATE = '2019-07-31';

module.exports = {
  DATE_FORMAT,
  STRICT_DATE_FORMATS,
  ASPEL_DATA_START_DATE
};

