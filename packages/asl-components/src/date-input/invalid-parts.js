const DAY = 'day';
const MONTH = 'month';
const YEAR = 'year';

// value is the emitted ISO-ish string `year-month-day` (see DateInput.emit).
function splitDateValue(value = '') {
    const [year = '', month = '', day = ''] = String(value).split('T')[0].split('-');
    return { day, month, year };
}

function getEndOfMonth(year, month) {
    const y = Number(year);
    const m = Number(month);

    switch (m) {
        case 2:
            return y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
            // This also applies when month is invalid (e.g. 0, 13, or NaN)
        default:
            return 31;
    }
}

function partIsInvalid(datePart, raw, { day, month, year } = {}) {
    const normalised = Number(raw);
    if (isNaN(normalised)) {
        return true;
    }

    if (datePart === YEAR) {
        return normalised < 1000
          || normalised > 9999
          || (Number(month) === 2 && Number(day) === 29 && getEndOfMonth(normalised, month) !== 29);
    }
    if (datePart === DAY) {
        return normalised < 1 || normalised > getEndOfMonth(year, month);
    }

    if (datePart === MONTH) {
        return normalised < 1
          || normalised > 12
          || (day <= 31 && day > getEndOfMonth(year, normalised));
    }

    throw new Error(`Unknown date part ${datePart}. Expected one of ${DAY}, ${MONTH}, ${YEAR}`);
}

// Returns the invalid parts in visual order (day, month, year); [] when no
// single part can be blamed.
function getInvalidDateParts(parts = {}) {
    return [DAY, MONTH, YEAR].filter(kind => partIsInvalid(kind, parts[kind], parts));
}

module.exports = { splitDateValue, getInvalidDateParts };
