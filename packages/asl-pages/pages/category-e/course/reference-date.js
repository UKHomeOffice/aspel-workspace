const { format, isValid, parseISO } = require('date-fns');
const { dateFormat } = require('../../../constants');

const padParts = (value) =>
  String(value)
    .split('-')
    .map((part, i) => part.padStart(i === 0 ? 4 : 2, '0'))
    .join('-');

const formatReferenceDate = (value) => {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : parseISO(padParts(value));

  return isValid(date) ? format(date, dateFormat.long) : '';
};

module.exports = { formatReferenceDate };
