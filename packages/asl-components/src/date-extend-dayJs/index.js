const dayjs = require('./core.js');
const { DATE_FORMAT, STRICT_DATE_FORMATS } = require('./formats');
const { parseDate } = require('./parse');
const {
    ASPEL_DATA_START_DATE,
    addWorkingDaysIso,
    configureBusinessDays,
    daysSinceDate,
    formatIsoDate,
    getAspelDataStart,
    todayIso
} = require('./business');
const { formatDate, formatReferenceDate } = require('./utils');

module.exports = Object.assign(dayjs, {
    dayjs,
    DATE_FORMAT,
    STRICT_DATE_FORMATS,
    parseDate,
    formatIsoDate,
    formatDate,
    formatReferenceDate,
    configureBusinessDays,
    addWorkingDaysIso,
    daysSinceDate,
    ASPEL_DATA_START_DATE,
    getAspelDataStart,
    todayIso
});

