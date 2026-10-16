const { formatReferenceDate } = require('../date-extend-dayJs/utils');
const { splitDateValue } = require('./invalid-parts');

const ORDER = ['day', 'month', 'year'];

function emptyParts(parts) {
    return ORDER.filter(part => String(parts[part] ?? '').trim() === '');
}

function describeMissing(names) {
    if (names.length === 1) {
        return `a ${names[0]}`;
    }
    if (names.length === 2) {
        return `a ${names[0]} and ${names[1]}`;
    }
    return `a ${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function ruleParam(validate = [], code) {
    const rule = (validate || []).find(r => r && typeof r === 'object' && code in r);
    return rule ? rule[code] : undefined;
}

function resolveIncomplete(parts) {
    const missing = emptyParts(parts);
    if (missing.length) {
        return { key: 'incomplete', context: { missingParts: describeMissing(missing) } };
    }
    if (!/^\d{4}$/.test(String(parts.year ?? '').trim())) {
        return { key: 'yearLength', context: {} };
    }
    return null;
}

const CONSTRAINTS = {
    dateIsBefore: { now: 'past', dated: 'before' },
    dateIsAfter: { now: 'future', dated: 'after' },
    dateIsSameOrBefore: { now: 'todayOrPast', dated: 'sameOrBefore' },
    dateIsSameOrAfter: { now: 'todayOrFuture', dated: 'sameOrAfter' }
};

function resolveDateError({ value, errorCode, validate }) {
    if (errorCode === 'aspelDataStartDate') {
        return { key: 'aspelDataStartDate', context: {} };
    }

    if (errorCode === 'required') {
        return { key: 'enter', context: {} };
    }

    if (errorCode === 'validDate') {
        return resolveIncomplete(splitDateValue(value)) || { key: 'realDate', context: {} };
    }

    const constraint = CONSTRAINTS[errorCode];
    if (constraint) {
        const param = ruleParam(validate, errorCode);
        const date = (param === 'now' || param == null) ? '' : formatReferenceDate(param);
        return date
            ? { key: constraint.dated, context: { date } }
            : { key: constraint.now, context: {} };
    }

    return null;
}

module.exports = { resolveDateError };

