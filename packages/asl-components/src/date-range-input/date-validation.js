const { parseDate: dayJsParseDate } = require('../date-extend-dayJs');
const { STRICT_DATE_FORMATS } = require('@ukhomeoffice/asl-constants');

function parseDate(value) {
    return dayJsParseDate(value, STRICT_DATE_FORMATS, true);
}

function getBoundaryErrorCode(value, { minDate, maxDate, minDateErrorCode = 'dateIsSameOrAfter' } = {}) {
    const date = parseDate(value);

    if (!date.isValid()) {
        return null;
    }

    if (maxDate && date.isAfter(maxDate === 'now' ? dayJsParseDate() : parseDate(maxDate), 'day')) {
        return 'dateIsSameOrBefore';
    }

    if (minDate && date.isBefore(parseDate(minDate), 'day')) {
        return minDateErrorCode;
    }

    return null;
}

module.exports = {
    parseDate,
    getBoundaryErrorCode
};
