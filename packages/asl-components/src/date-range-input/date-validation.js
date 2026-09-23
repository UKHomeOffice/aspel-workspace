const moment = require('moment');

const ASPEL_DATA_START_DATE = '2019-07-31';
const DATE_FORMATS = ['YYYY-MM-DD', 'YYYY-M-D'];

function parseDate(value) {
    return moment(value, DATE_FORMATS, true);
}

function getBoundaryErrorCode(value) {
    const date = parseDate(value);

    if (!date.isValid()) {
        return null;
    }

    if (date.isAfter(moment(), 'day')) {
        return 'dateIsSameOrBefore';
    }

    if (date.isBefore(ASPEL_DATA_START_DATE, 'day')) {
        return 'aspelDataStartDate';
    }

    return null;
}

module.exports = {
    parseDate,
    getBoundaryErrorCode
};