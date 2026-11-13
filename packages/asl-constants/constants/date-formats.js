const DATE_FORMAT = {
  long: 'D MMMM YYYY',
  medium: 'D MMM YYYY',
  short: 'D MMM YYYY',
  shortYear: 'DD MMM YY',
  dayMonth: 'D MMM',
  day: 'D',

  year: 'YYYY',
  month: 'MMMM',
  yearMonth: 'MMMM YYYY',
  monthYear: 'MMMM YYYY',

  time: 'h:mma',
  timeShort: 'HH:mm',

  timestamp: 'D MMMM YYYY [at] h:mma',
  timestampShort: 'D MMMM YYYY HH:mm',
  datetimeLong: 'h:mma, D MMM YYYY',

  iso: 'YYYY-MM-DD',
  isoDateTime: 'YYYY-MM-DDTHH:mm:ss[Z]'
};

const STRICT_DATE_FORMATS = ['YYYY-MM-DD', 'YYYY-M-D'];

// ASPEL project start date - all historical data begins from this date
const ASPEL_DATA_START_DATE = '2019-07-31';

module.exports = {
  DATE_FORMAT,
  STRICT_DATE_FORMATS,
  ASPEL_DATA_START_DATE
};

