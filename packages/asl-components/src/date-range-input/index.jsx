import React, { useState } from 'react';
import { dateValidation } from '@ukhomeoffice/asl-constants';
import DateInput from '../date-input';
import DateErrorMessage from '../date-input/error-message';

const defaultFields = {
    from: {
        label: 'Date from',
        hint: 'For example 01 01 2020'
    },
    to: {
        label: 'Date to',
        hint: 'For example 12 12 2020'
    }
};

const emptyValues = {};

function getDateError({ name, field, value, errors = {}, validate = {} }) {
    const errorCode = errors[name];
    if (!errorCode) {
        return null;
    }
    return <DateErrorMessage name={name} value={value} errorCode={errorCode} validate={validate[name] || field.validate} />;
}

function parseDate(value) {
    return dateValidation.parseDate(value);
}

function getBoundaryErrorCode(value) {
    return dateValidation.getBoundaryErrorCode(value);
}

function getBoundaryError({ fieldName, value, errorCode }) {
    if (!errorCode) {
        return null;
    }

    return <DateErrorMessage
        name={fieldName}
        value={value}
        errorCode={errorCode}
        validate={errorCode === 'dateIsSameOrBefore' ? [{ dateIsSameOrBefore: 'now' }] : undefined}
    />;
}

function getRangeError({ fieldName, value, range, errors, changedFieldName, hasBoundaryError }) {
    const targetFieldName = changedFieldName || 'date-to';
    const fromValue = range['date-from'] ?? '';
    const toValue = range['date-to'] ?? '';

    if (fieldName !== targetFieldName || errors['date-from'] || errors['date-to']) {
        return null;
    }

    if (hasBoundaryError) {
        return null;
    }

    const fromDate = parseDate(fromValue);
    const toDate = parseDate(toValue);

    if (!fromDate.isValid() || !toDate.isValid() || fromDate.isSameOrBefore(toDate, 'day')) {
        return null;
    }

    const errorCode = targetFieldName === 'date-to' ? 'dateIsAfter' : 'dateIsBefore';
    const constraintValue = targetFieldName === 'date-to' ? fromValue : toValue;

    return <DateErrorMessage name={fieldName} value={value} errorCode={errorCode} validate={[{ [errorCode]: constraintValue }]} />;
}

export default function DateRangeInput({
    label,
    hint,
    values,
    errors = {},
    validate = {},
    onChange
}) {
    const rangeFields = [
        { name: 'date-from', key: 'from' },
        { name: 'date-to', key: 'to' }
    ];
    const [range, setRange] = useState(() => values || emptyValues);
    const [changedFieldName, setChangedFieldName] = useState(null);
    const fromBoundaryErrorCode = getBoundaryErrorCode(range['date-from'] ?? '');
    const toBoundaryErrorCode = getBoundaryErrorCode(range['date-to'] ?? '');
    const hasBoundaryError = Boolean(fromBoundaryErrorCode || toBoundaryErrorCode);

    function update(fieldName, value) {
        setChangedFieldName(fieldName);
        setRange(previousRange => {
            const nextRange = {
                ...previousRange,
                [fieldName]: value
            };
            onChange && onChange(nextRange);
            return nextRange;
        });
    }

    return (
        <div className="date-range-input">
            <fieldset className="govuk-fieldset">
                {label && (
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                        <h2 className="govuk-fieldset__heading">{label}</h2>
                    </legend>
                )}
                {hint}
                <div className="date-range-input__fields">
                    {
                        rangeFields.map(({ name: fieldName, key }) => {
                            const field = defaultFields[key];
                            const value = range[fieldName] ?? '';
                            const error = getDateError({
                                name: fieldName,
                                field,
                                value,
                                errors,
                                validate
                            }) || getBoundaryError({
                                field,
                                fieldName,
                                value,
                                errorCode: fieldName === 'date-from' ? fromBoundaryErrorCode : toBoundaryErrorCode
                            }) || getRangeError({
                                field,
                                fieldName,
                                value,
                                range,
                                errors,
                                changedFieldName,
                                hasBoundaryError
                            });
                            return (
                                <div className="date-range-input__field" key={fieldName}>
                                    <DateInput
                                        {...field}
                                        name={fieldName}
                                        value={value}
                                        error={error}
                                        onChange={value => update(fieldName, value)}
                                    />
                                </div>
                            );
                        })
                    }
                </div>
            </fieldset>
        </div>
    );
}