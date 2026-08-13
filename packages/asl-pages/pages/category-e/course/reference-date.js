const { format, isValid, parseISO } = require('date-fns');
const { dateFormat } = require('../../../constants');

// Dates submitted by the date inputs arrive unpadded ("2026-9-1"), which parseISO
// rejects, so pad the parts back to yyyy-mm-dd first.
const padParts = (value) =>
  String(value)
    .split('-')
    .map((part, i) => part.padStart(i === 0 ? 4 : 2, '0'))
    .join('-');

/**
 * Formats a date that gets played back inside an error message, e.g. "Course date
 * must be the same as or before the PPL expiry date 1 September 2026". GDS wants
 * "1 September 2026" - no ordinal, no leading zero.
 *
 * Returns '' for anything that isn't a real date. The reference date can be
 * another field the user just typed, so it may well be garbage; the content
 * templates only play the date back when it is non-empty, which leaves the
 * message readable instead of trailing "Invalid date entered".
 */
const formatReferenceDate = (value) => {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : parseISO(padParts(value));

  return isValid(date) ? format(date, dateFormat.long) : '';
};

module.exports = { formatReferenceDate };
