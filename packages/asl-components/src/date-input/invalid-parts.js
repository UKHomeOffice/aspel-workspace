const DAY = 'day';
const MONTH = 'month';
const YEAR = 'year';

// value is the emitted ISO-ish string `year-month-day` (see DateInput.emit).
function splitDateValue(value = '') {
    const [year = '', month = '', day = ''] = String(value).split('T')[0].split('-');
    return { day, month, year };
}

function partIsInvalid(datePart, raw) {
    const normalised = Number(raw);
    if (isNaN(normalised)) {
        return true;
    }

    if (datePart === YEAR) {
        return normalised < 1000 || normalised > 9999;
    }
    if (datePart === DAY) {
        // For months with <31 days - the whole date field will be highlighted.
        return normalised < 1 || normalised > 31;
    }

    if (datePart === MONTH) {
        return normalised < 1 || normalised > 12;
    }

    throw new Error(`Unknown date part ${datePart}. Expected one of ${DAY}, ${MONTH}, ${YEAR}`);
}

// Returns the invalid parts in visual order (day, month, year); [] when no
// single part can be blamed.
function getInvalidDateParts(parts = {}) {
    const dateParts = typeof parts === 'string'
        ? splitDateValue(parts)
        : parts;

    const missing = [DAY, MONTH, YEAR].filter(key => !dateParts[key]);

    const invalid =  [DAY, MONTH, YEAR]
        .filter(key => !missing.includes(key))
        .filter(key => partIsInvalid(key, dateParts[key]));

    // highlight the date as a whole if there's incorrect information in more than one field.
    // https://design-system.service.gov.uk/components/date-input/#if-the-date-entered-cannot-be-correct
    if(invalid.length > 1) {
        return [DAY, MONTH, YEAR];
    }

    return [DAY, MONTH, YEAR].filter(key => missing.includes(key) || invalid.includes(key));
}

module.exports = { splitDateValue, getInvalidDateParts };
