import React, { useMemo, useState } from 'react';
import DateInput from '../date-input';
import DateErrorMessage from '../date-input/error-message';
import {
    getAspelDataStart,
    getDateBoundaryError,
    isInvalidDateValue,
    parseOptionalDate
} from '../date-extend-dayJs';

const DATE_FROM = 'date-from';
const DATE_TO = 'date-to';

function getBoundaryError(name, parsed) {
    return getDateBoundaryError({
        parsed,
        minDate: name === DATE_FROM ? getAspelDataStart() : null,
        minDateErrorCode: name === DATE_FROM ? 'aspelDataStartDate' : null,
        maxDate: new Date(),
        maxDateErrorCode: 'dateIsSameOrBefore'
    });
}

function getRangeErrors({ parsedFrom, parsedTo, boundaryErrors, lastChanged }) {
    if (!parsedFrom || !parsedTo) {
        return {};
    }

    if (boundaryErrors[DATE_FROM] || boundaryErrors[DATE_TO]) {
        return {};
    }

    if (parsedFrom.isAfter(parsedTo, 'day')) {
        return lastChanged === DATE_TO
            ? { [DATE_TO]: 'dateIsAfter' }
            : { [DATE_FROM]: 'dateIsBefore' };
    }

    return {};
}

function getValidate(errorCode, otherValue) {
    switch (errorCode) {
        case 'dateIsBefore':
            return [{ dateIsBefore: otherValue }];
        case 'dateIsAfter':
            return [{ dateIsAfter: otherValue }];
        case 'dateIsSameOrBefore':
            return [{ dateIsSameOrBefore: 'now' }];
        default:
            return undefined;
    }
}

export default function DateRangeInput({ label = 'Date range', values, errors = {}, onChange = () => {} }) {
    const [currentValues, setCurrentValues] = useState(() => values || {});
    const [lastChanged, setLastChanged] = useState(DATE_FROM);

    const validation = useMemo(() => {
        const parsedFrom = parseOptionalDate(currentValues[DATE_FROM]);
        const parsedTo = parseOptionalDate(currentValues[DATE_TO]);

        const boundaryErrors = {
            [DATE_FROM]: errors[DATE_FROM] || (isInvalidDateValue(currentValues[DATE_FROM]) ? null : getBoundaryError(DATE_FROM, parsedFrom)),
            [DATE_TO]: errors[DATE_TO] || (isInvalidDateValue(currentValues[DATE_TO]) ? null : getBoundaryError(DATE_TO, parsedTo))
        };

        const rangeErrors = isInvalidDateValue(currentValues[DATE_FROM]) || isInvalidDateValue(currentValues[DATE_TO])
            ? {}
            : getRangeErrors({ parsedFrom, parsedTo, boundaryErrors, lastChanged });

        return {
            errorCodes: {
                [DATE_FROM]: boundaryErrors[DATE_FROM] || rangeErrors[DATE_FROM] || null,
                [DATE_TO]: boundaryErrors[DATE_TO] || rangeErrors[DATE_TO] || null
            }
        };
    }, [currentValues, errors, lastChanged]);

    const update = (name, value) => {
        setLastChanged(name);
        setCurrentValues(prev => {
            const next = { ...prev, [name]: value };
            onChange(next);
            return next;
        });
    };

    const renderDate = (name, heading, hint) => {
        const errorCode = validation.errorCodes[name];
        const otherName = name === DATE_FROM ? DATE_TO : DATE_FROM;
        const error = errorCode
            ? <DateErrorMessage name={name} value={currentValues[name]} errorCode={errorCode} validate={getValidate(errorCode, currentValues[otherName])} />
            : null;

        return (
            <div className="date-range-input__field">
                <DateInput
                    name={name}
                    label={heading}
                    hint={hint}
                    value={currentValues[name]}
                    error={error}
                    onChange={value => update(name, value)}
                />
            </div>
        );
    };

    return (
        <div className="date-range-input govuk-form-group">
            <fieldset className="govuk-fieldset">
                <legend className="govuk-fieldset__legend">
                    <h2 className="govuk-fieldset__heading govuk-heading-l">{label}</h2>
                </legend>
                <div className="date-range-input__fields">
                    {renderDate(DATE_FROM, 'Date from', 'For example 01 01 2020')}
                    {renderDate(DATE_TO, 'Date to', 'For example 12 12 2020')}
                </div>
            </fieldset>
        </div>
    );
}

