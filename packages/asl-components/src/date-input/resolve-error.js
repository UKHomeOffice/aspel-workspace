import moment from 'moment';
import { splitDateValue } from './invalid-parts';

// Maps a date error to the GOV.UK Design System message model. GDS uses specific,
// priority-ordered messages rather than one generic "invalid date":
//   1. nothing entered        -> "Enter <thing>"
//   2. incomplete             -> "<Thing> must include a <day/month/year>"
//                                 (or "Year must include 4 numbers")
//   3. cannot be correct       -> "<Thing> must be a real date"
//   4. constraint (past/future/before/after ...)
// https://design-system.service.gov.uk/components/date-input/#error-messages
//
// The server returns a single error code per field, so we recover the finer GDS
// state from the submitted value: `required` => nothing; `validDate` => either
// incomplete (a part is empty) or not-a-real-date; the dateIs* codes => the
// relevant constraint (with the reference date pulled from the field's rule).

const ORDER = ['day', 'month', 'year'];

function emptyParts(parts) {
    return ORDER.filter(part => String(parts[part] ?? '').trim() === '');
}

// "a day" / "a day and month" / "a day, month and year"
function describeMissing(names) {
    if (names.length === 1) {
        return `a ${names[0]}`;
    }
    if (names.length === 2) {
        return `a ${names[0]} and ${names[1]}`;
    }
    return `a ${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

// The param a dateIs* rule was configured with, e.g. { dateIsBefore: 'now' }.
function ruleParam(validate = [], code) {
    const rule = (validate || []).find(r => r && typeof r === 'object' && code in r);
    return rule ? rule[code] : undefined;
}

function formatReferenceDate(param) {
    const m = moment(param, ['YYYY-MM-DD', moment.ISO_8601], true);
    return m.isValid() ? m.format('D MMMM YYYY') : '';
}

function resolveIncomplete(parts) {
    const missing = emptyParts(parts);
    if (missing.length) {
        return { key: 'incomplete', context: { missingParts: describeMissing(missing) } };
    }
    // Everything is filled in but the year isn't four digits.
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

// Returns { key, context } for the message, or null when the code is unknown
// (caller then falls back to the field's generic error text).
export function resolveDateError({ value, errorCode, validate }) {
    if (errorCode === 'required') {
        return { key: 'enter', context: {} };
    }

    if (errorCode === 'validDate') {
        return resolveIncomplete(splitDateValue(value)) || { key: 'realDate', context: {} };
    }

    const constraint = CONSTRAINTS[errorCode];
    if (constraint) {
        const param = ruleParam(validate, errorCode);
        if (param === 'now' || param == null) {
            return { key: constraint.now, context: {} };
        }
        return { key: constraint.dated, context: { date: formatReferenceDate(param) } };
    }

    return null;
}
