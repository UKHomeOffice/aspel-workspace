const { parseDate } = require('./parse');

function hasDateValue(value) {
    return !!String(value || '').trim();
}

function parseOptionalDate(value) {
    if (!hasDateValue(value)) {
        return null;
    }

    const parsed = parseDate(value);
    return parsed.isValid() ? parsed : null;
}

function isInvalidDateValue(value) {
    return hasDateValue(value) && !parseOptionalDate(value);
}

function normaliseComparableDate(value) {
    if (value == null || value === '') {
        return null;
    }

    const parsed = parseDate(value);
    return parsed.isValid() ? parsed : null;
}

function getDateBoundaryError({ parsed, minDate, minDateErrorCode, maxDate, maxDateErrorCode, unit = 'day' }) {
    if (!parsed) {
        return null;
    }

    const min = normaliseComparableDate(minDate);
    if (min && minDateErrorCode && parsed.isBefore(min, unit)) {
        return minDateErrorCode;
    }

    const max = normaliseComparableDate(maxDate);
    if (max && maxDateErrorCode && parsed.isAfter(max, unit)) {
        return maxDateErrorCode;
    }

    return null;
}

module.exports = {
    getDateBoundaryError,
    hasDateValue,
    isInvalidDateValue,
    parseOptionalDate
};

