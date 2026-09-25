const dayjs = require('./core.js');
const { DATE_FORMAT, STRICT_DATE_FORMATS } = require('./formats');
const { parseDate } = require('./parse');
const {
    getDateBoundaryError,
    hasDateValue,
    isInvalidDateValue,
    parseOptionalDate
} = require('./validation.js');
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
    parseOptionalDate,
    hasDateValue,
    isInvalidDateValue,
    getDateBoundaryError,
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

