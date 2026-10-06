const moment = require('moment');

const DATE_FORMATS = ['YYYY-MM-DD', 'YYYY-M-D'];

function parseDate(value) {
    return moment(value, DATE_FORMATS, true);
}

function getBoundaryErrorCode(value, { minDate, maxDate, minDateErrorCode = 'dateIsSameOrAfter' } = {}) {
    const date = parseDate(value);

    if (!date.isValid()) {
        return null;
    }

    if (maxDate && date.isAfter(maxDate === 'now' ? moment() : parseDate(maxDate), 'day')) {
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
