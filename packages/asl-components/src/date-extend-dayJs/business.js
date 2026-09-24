const { bankHolidays } = require('@ukhomeoffice/asl-constants');
const dayjs = require('./core.js');
const { DATE_FORMAT } = require('./formats');
const { parseDate } = require('./parse');

const ASPEL_DATA_START_DATE = '2019-07-31';

function configureBusinessDays() {
    dayjs.updateLocale('en', { holidays: bankHolidays });
    return dayjs;
}

function getAspelDataStart() {
    return parseDate(ASPEL_DATA_START_DATE, 'YYYY-MM-DD', true);
}

function formatIsoDate(date) {
    if(date && dayjs.isValid(date)) {
        return dayjs.format(date, DATE_FORMAT.iso);
    }

    return '';
}

function todayIso() {
    return formatIsoDate(new Date());
}

function addWorkingDaysIso(date, amount) {
    configureBusinessDays();
    return dayjs(date).addWorkingTime(amount, 'days').format(DATE_FORMAT.iso);
}

function daysSinceDate(date, from = new Date()) {
    return dayjs(from).diff(dayjs(date), 'days');
}

configureBusinessDays();

module.exports = {
    ASPEL_DATA_START_DATE,
    addWorkingDaysIso,
    configureBusinessDays,
    daysSinceDate,
    formatIsoDate,
    getAspelDataStart,
    todayIso
};

