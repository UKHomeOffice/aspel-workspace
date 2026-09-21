const dayjs = require('@ukhomeoffice/asl-components/src/dayjs.js');
const { format, isValid } = dayjs;
const { dateFormat } = require('../../../constants');

const invalidDate = () => new Date(Number.NaN);

const parseReferenceDate = (value) => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value !== 'string') {
    return invalidDate();
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return invalidDate();
  }

  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
    const parsed = dayjs(trimmed, ['YYYY-MM-DD', 'YYYY-M-D'], true);
    return parsed.isValid() ? parsed.toDate() : invalidDate();
  }

  if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
    const parsed = dayjs(trimmed);
    return parsed.isValid() && parsed.format('YYYY-MM-DD') === trimmed.slice(0, 10)
      ? parsed.toDate()
      : invalidDate();
  }

  return invalidDate();
};

const formatReferenceDate = (value) => {
  if (!value) {
    return '';
  }

  const date = parseReferenceDate(value);

  return isValid(date) ? format(date, dateFormat.long) : '';
};

module.exports = { formatReferenceDate };
