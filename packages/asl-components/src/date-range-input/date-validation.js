const dayjs = require('../date-extend-dayJs');
const { parseDate: dayJsParseDate } = dayjs;
const { STRICT_DATE_FORMATS } = require('@ukhomeoffice/asl-constants');

function parseDate(value) {
    return dayJsParseDate(value, STRICT_DATE_FORMATS, true);
}

function getBoundaryErrorCode(value, { minDate, maxDate, minDateErrorCode = 'dateIsSameOrAfter' } = {}) {
    const date = parseDate(value);

    if (!date.isValid()) {
        return null;
    }

    if (maxDate) {
        const maxDateValue = maxDate === 'now' ? dayjs.dayjs() : parseDate(maxDate);
        if (date.isAfter(maxDateValue, 'day')) {
            return 'dateIsSameOrBefore';
        }
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
