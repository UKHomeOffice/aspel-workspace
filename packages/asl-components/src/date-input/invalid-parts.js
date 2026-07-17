const DAY = 'day';
const MONTH = 'month';
const YEAR = 'year';

// Accepts either the GOV.UK object shape ({ day, month, year }) or the
// persisted ISO-ish string `year-month-day`.
function splitDateValue(value = '') {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return {
            day: String(value.day ?? ''),
            month: String(value.month ?? ''),
            year: String(value.year ?? '')
        };
    }
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
