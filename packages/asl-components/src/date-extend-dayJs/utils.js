const dayjs = require('./core.js');
const { DATE_FORMAT } = require('./formats');
const { parseDate } = require('./parse');

const formatDate = (date, format = DATE_FORMAT.long) => {
    try {
        return date ? dayjs.format(date, format) : '-';
    } catch (err) {
        return 'Invalid date entered';
    }
};

const formatReferenceDate = (param) => {
    if (param == null || param === '') {
        return '';
    }

    const date = parseDate(param);
    return date.isValid() ? date.format(DATE_FORMAT.long) : '';
};

module.exports = {
    DATE_FORMAT,
    formatDate,
    formatReferenceDate
};

