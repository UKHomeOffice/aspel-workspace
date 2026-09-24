const dayjs = require('./core.js');
const { STRICT_DATE_FORMATS } = require('./formats');

function parseDate(value, format = STRICT_DATE_FORMATS, strict = true) {
    if (arguments.length === 1 && typeof value !== 'string') {
        return dayjs(value);
    }

    return dayjs(value, format, strict);
}

module.exports = {
    parseDate,
    STRICT_DATE_FORMATS
};

