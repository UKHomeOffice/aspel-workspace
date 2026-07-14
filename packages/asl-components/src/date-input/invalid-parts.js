// Shared date-part validation used by BOTH the DateInput (to highlight only the
// bad inputs) and the ErrorSummary (to point its link at the first bad input),
// so the two always agree. The server validates the whole date and returns a
// single error, so this is a best-effort split: it flags a part only when that
// part is individually wrong (empty, non-numeric or out of range). When the
// parts are each individually fine but the date as a whole is still invalid
// (e.g. 31/02, or a future date), this returns [] and callers fall back to
// treating the whole field as in error.

const DAY = 'day';
const MONTH = 'month';
const YEAR = 'year';

// value is the emitted ISO-ish string `year-month-day` (see DateInput.emit).
function splitDateValue(value = '') {
    const [year = '', month = '', day = ''] = String(value).split('T')[0].split('-');
    return { day, month, year };
}

function partIsInvalid(kind, raw) {
    const s = String(raw ?? '').trim();
    if (kind === YEAR) {
        return !/^\d{4}$/.test(s) || Number(s) < 1;
    }
    if (!/^\d+$/.test(s)) {
        return true;
    }
    const n = Number(s);
    if (kind === DAY) {
        return n < 1 || n > 31;
    }
    // month
    return n < 1 || n > 12;
}

// Returns the invalid parts in visual order (day, month, year); [] when no
// single part can be blamed.
function getInvalidDateParts(parts = {}) {
    return [DAY, MONTH, YEAR].filter(kind => partIsInvalid(kind, parts[kind]));
}

module.exports = { splitDateValue, getInvalidDateParts };
