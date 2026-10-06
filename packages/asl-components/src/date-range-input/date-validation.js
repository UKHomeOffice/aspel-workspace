const { parseDate: dayJsParseDate } = require('../date-extend-dayJs');

const DATE_FORMATS = ['YYYY-MM-DD', 'YYYY-M-D'];

function parseDate(value) {
    return dayJsParseDate(value, DATE_FORMATS, true);
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
