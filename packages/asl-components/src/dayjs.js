const coreDayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isBetween = require('dayjs/plugin/isBetween');
const minMax = require('dayjs/plugin/minMax');
const utc = require('dayjs/plugin/utc');
const updateLocale = require('dayjs/plugin/updateLocale');
const relativeTime = require('dayjs/plugin/relativeTime');
const duration = require('dayjs/plugin/duration');
const objectSupport = require('dayjs/plugin/objectSupport');

coreDayjs.extend(customParseFormat);
coreDayjs.extend(isSameOrBefore);
coreDayjs.extend(isSameOrAfter);
coreDayjs.extend(isBetween);
coreDayjs.extend(minMax);
coreDayjs.extend(utc);
coreDayjs.extend(updateLocale);
coreDayjs.extend(relativeTime);
coreDayjs.extend(duration);
coreDayjs.extend(objectSupport);

const DATE_FNS_TO_DAYJS_TOKENS = {
    yyyy: 'YYYY',
    yy: 'YY',
    dd: 'DD',
    d: 'D'
};

function normaliseFormat(format = '') {
    return format.replace(/yyyy|yy|dd|d/g, token => DATE_FNS_TO_DAYJS_TOKENS[token] || token);
}

function invalidDate() {
    return new Date(Number.NaN);
}

function isDateObject(value) {
    return value instanceof Date;
}

function toCompatibleDuration(value, unit) {
    if (typeof value === 'object' && value !== null && unit == null) {
        return { ...value };
    }

    const aliases = {
        year: 'years',
        years: 'years',
        month: 'months',
        months: 'months',
        day: 'days',
        days: 'days',
        hour: 'hours',
        hours: 'hours',
        minute: 'minutes',
        minutes: 'minutes',
        second: 'seconds',
        seconds: 'seconds',
        millisecond: 'milliseconds',
        milliseconds: 'milliseconds'
    };

    const key = aliases[unit] || unit;
    return { [key]: value };
}

function toDayjs(value, format, strict = false) {
    if (coreDayjs.isDayjs(value)) {
        return value.clone();
    }

    if (value == null || value === '') {
        return coreDayjs(invalidDate());
    }

    if (Array.isArray(format)) {
        const formats = format.map(candidate => normaliseFormat(candidate));

        for (const candidate of formats) {
            const parsed = coreDayjs(value, candidate, strict);
            if (parsed.isValid()) {
                return parsed;
            }
        }

        return coreDayjs(value, formats[0], strict);
    }

    if (format) {
        return coreDayjs(value, normaliseFormat(format), strict);
    }

    if (isDateObject(value)) {
        return coreDayjs(value);
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();

        if (!trimmed) {
            return coreDayjs(invalidDate());
        }

        if (/^\d{1,2}-\d{1,2}-\d{2,4}$/.test(trimmed)) {
            return coreDayjs(invalidDate());
        }

        const strictDateFormats = ['YYYY-MM-DD', 'YYYY-M-D'];
        for (const candidate of strictDateFormats) {
            const parsed = coreDayjs(trimmed, candidate, true);
            if (parsed.isValid()) {
                return parsed;
            }
        }

        return coreDayjs(trimmed);
    }

    return coreDayjs(value);
}

function assertValid(value) {
    const parsed = toDayjs(value);
    if (!parsed.isValid()) {
        throw new RangeError('Invalid time value');
    }
    return parsed;
}

function toDate(value) {
    if (value == null || value === '') {
        return invalidDate();
    }

    if (isDateObject(value)) {
        return new Date(value.getTime());
    }

    const parsed = toDayjs(value);
    return parsed.isValid() ? parsed.toDate() : invalidDate();
}

function isValid(value) {
    if (value == null || value === '') {
        return false;
    }

    if (isDateObject(value)) {
        return !Number.isNaN(value.getTime());
    }

    return toDayjs(value).isValid();
}

function parseISO(value) {
    return toDate(value);
}

function format(value, pattern) {
    return assertValid(value).format(normaliseFormat(pattern));
}

function differenceInDays(left, right) {
    return assertValid(left).diff(assertValid(right), 'day');
}

function differenceInWeeks(left, right) {
    return assertValid(left).diff(assertValid(right), 'week');
}

function differenceInMonths(left, right) {
    return assertValid(left).diff(assertValid(right), 'month');
}

function differenceInYears(left, right) {
    return assertValid(left).diff(assertValid(right), 'year');
}

function differenceInCalendarDays(left, right) {
    return assertValid(left).startOf('day').diff(assertValid(right).startOf('day'), 'day');
}

function isBefore(left, right) {
    return assertValid(left).isBefore(assertValid(right));
}

function isAfter(left, right) {
    return assertValid(left).isAfter(assertValid(right));
}

function isFuture(value) {
    return assertValid(value).isAfter(coreDayjs());
}

function isSameDay(left, right) {
    return assertValid(left).isSame(assertValid(right), 'day');
}

function isToday(value) {
    return assertValid(value).isSame(coreDayjs(), 'day');
}

function addDays(value, amount) {
    return assertValid(value).add(amount, 'day').toDate();
}

function addWeeks(value, amount) {
    return assertValid(value).add(amount, 'week').toDate();
}

function addMonths(value, amount) {
    return assertValid(value).add(amount, 'month').toDate();
}

function addYears(value, amount) {
    return assertValid(value).add(amount, 'year').toDate();
}

function endOfDay(value) {
    return assertValid(value).endOf('day').toDate();
}

function endOfTomorrow() {
    return coreDayjs().add(1, 'day').endOf('day').toDate();
}

function subMilliseconds(value, amount) {
    return assertValid(value).subtract(amount, 'millisecond').toDate();
}

function formatDistance(left, right, options = {}) {
    const start = assertValid(left);
    const end = assertValid(right);

    if (options.addSuffix) {
        return start.from(end);
    }

    return coreDayjs.duration(Math.abs(start.diff(end))).humanize();
}

function getMonth(value) {
    return assertValid(value).month();
}

function getYear(value) {
    return assertValid(value).year();
}

function getHolidaySet(instance) {
    const locale = typeof instance.$locale === 'function' ? instance.$locale() : {};
    return new Set(locale.holidays || []);
}

function isBusinessDay(instance) {
    const date = assertValid(instance).startOf('day');
    const dayOfWeek = date.day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
    }
    return !getHolidaySet(date).has(date.format('YYYY-MM-DD'));
}

function businessPlugin(_, DayjsClass, dayjsFactory) {
    DayjsClass.prototype.addWorkingTime = function(amount, unit) {
        if (!['day', 'days'].includes(unit)) {
            return this.add(amount, unit);
        }

        let remaining = Math.abs(amount);
        let cursor = this.clone();
        const direction = amount < 0 ? -1 : 1;

        while (remaining > 0) {
            cursor = cursor.add(direction, 'day');
            if (isBusinessDay(cursor)) {
                remaining -= 1;
            }
        }

        return cursor;
    };

    DayjsClass.prototype.subtractWorkingTime = function(amount, unit) {
        return this.addWorkingTime(-amount, unit);
    };

    DayjsClass.prototype.workingDiff = function(other, unit) {
        if (unit !== 'calendarDays') {
            return this.diff(other, unit);
        }

        const left = dayjsFactory(this).startOf('day');
        const right = assertValid(other).startOf('day');

        if (left.isSame(right)) {
            return 0;
        }

        const sign = left.isAfter(right) ? 1 : -1;
        const start = sign > 0 ? right : left;
        const end = sign > 0 ? left : right;
        let cursor = start;
        let days = 0;

        while (cursor.isBefore(end, 'day')) {
            cursor = cursor.add(1, 'day');
            if (isBusinessDay(cursor)) {
                days += 1;
            }
        }

        return days * sign;
    };

    DayjsClass.prototype.isBusinessDay = function() {
        return isBusinessDay(this);
    };
}

coreDayjs.extend(businessPlugin);

function dayjs(value, format, strict) {
    if (arguments.length === 0) {
        return coreDayjs();
    }

    if (arguments.length === 1 && value === undefined) {
        return coreDayjs();
    }

    return toDayjs(value, format, strict);
}

dayjs.default = dayjs;
dayjs.dayjs = dayjs;
dayjs.extend = coreDayjs.extend.bind(coreDayjs);
dayjs.locale = coreDayjs.locale.bind(coreDayjs);
dayjs.updateLocale = coreDayjs.updateLocale.bind(coreDayjs);
dayjs.utc = (...args) => coreDayjs.utc(...args);
dayjs.isDayjs = coreDayjs.isDayjs;
dayjs.duration = toCompatibleDuration;
dayjs.max = (...args) => coreDayjs.max((Array.isArray(args[0]) && args.length === 1 ? args[0] : args).map(item => assertValid(item)));
dayjs.min = (...args) => coreDayjs.min((Array.isArray(args[0]) && args.length === 1 ? args[0] : args).map(item => assertValid(item)));
dayjs.toDate = toDate;
dayjs.isValid = isValid;
dayjs.parseISO = parseISO;
dayjs.format = format;
dayjs.differenceInDays = differenceInDays;
dayjs.differenceInWeeks = differenceInWeeks;
dayjs.differenceInMonths = differenceInMonths;
dayjs.differenceInYears = differenceInYears;
dayjs.differenceInCalendarDays = differenceInCalendarDays;
dayjs.isBefore = isBefore;
dayjs.isAfter = isAfter;
dayjs.isFuture = isFuture;
dayjs.isSameDay = isSameDay;
dayjs.isToday = isToday;
dayjs.addDays = addDays;
dayjs.addWeeks = addWeeks;
dayjs.addMonths = addMonths;
dayjs.addYears = addYears;
dayjs.endOfDay = endOfDay;
dayjs.endOfTomorrow = endOfTomorrow;
dayjs.subMilliseconds = subMilliseconds;
dayjs.formatDistance = formatDistance;
dayjs.getMonth = getMonth;
dayjs.getYear = getYear;
dayjs.normaliseFormat = normaliseFormat;
dayjs.isBusinessDay = value => isBusinessDay(assertValid(value));

module.exports = dayjs;

