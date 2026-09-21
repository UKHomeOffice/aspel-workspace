import React, { useState } from 'react';
import { dateValidation } from '@ukhomeoffice/asl-constants';
import DateInput from '../date-input';
import DateErrorMessage from '../date-input/error-message';

const defaultFieldNames = {
    from: 'date-from',
    to: 'date-to'
};

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

function getDateLabel(field) {
    return field.dateLabel || field.label;
}

function getDateError({ name, field, value, errors = {}, validate = {} }) {
    const errorCode = errors[name];
    if (!errorCode) {
        return null;
    }
    return <DateErrorMessage name={name} value={value} errorCode={errorCode} validate={validate[name] || field.validate} dateLabel={getDateLabel(field)} />;
}

function parseDate(value) {
    return dateValidation.parseDate(value);
}

function getBoundaryErrorCode(value) {
    return dateValidation.getBoundaryErrorCode(value);
}

function getBoundaryError({ field, fieldName, value, errorCode }) {
    if (!errorCode) {
        return null;
    }

    return <DateErrorMessage
        name={fieldName}
        value={value}
        errorCode={errorCode}
        validate={errorCode === 'dateIsSameOrBefore' ? [{ dateIsSameOrBefore: 'now' }] : undefined}
        dateLabel={getDateLabel(field)}
    />;
}

function getRangeError({ field, fieldName, value, range, errors, changedFieldName, hasBoundaryError, fromFieldName, toFieldName }) {
    const targetFieldName = changedFieldName || toFieldName;
    const fromValue = range[fromFieldName] ?? '';
    const toValue = range[toFieldName] ?? '';

    if (fieldName !== targetFieldName || errors[fromFieldName] || errors[toFieldName]) {
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

    const errorCode = targetFieldName === toFieldName ? 'dateIsAfter' : 'dateIsBefore';
    const constraintValue = targetFieldName === toFieldName ? fromValue : toValue;

    return <DateErrorMessage name={fieldName} value={value} errorCode={errorCode} validate={[{ [errorCode]: constraintValue }]} dateLabel={getDateLabel(field)} />;
}

export default function DateRangeInput({
    label,
    hint,
    values,
    errors = {},
    validate = {},
    onChange,
    fieldNames = defaultFieldNames,
    fields = {}
}) {
    const fromFieldName = fieldNames.from || defaultFieldNames.from;
    const toFieldName = fieldNames.to || defaultFieldNames.to;
    const rangeFields = [
        { name: fromFieldName, key: 'from' },
        { name: toFieldName, key: 'to' }
    ];
    const [range, setRange] = useState(() => values || emptyValues);
    const [changedFieldName, setChangedFieldName] = useState(null);
    const fromBoundaryErrorCode = getBoundaryErrorCode(range[fromFieldName] ?? '');
    const toBoundaryErrorCode = getBoundaryErrorCode(range[toFieldName] ?? '');
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
                            const field = {
                                ...defaultFields[key],
                                ...(fields[key] || fields[fieldName] || {})
                            };
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
                                errorCode: fieldName === fromFieldName ? fromBoundaryErrorCode : toBoundaryErrorCode
                            }) || getRangeError({
                                field,
                                fieldName,
                                value,
                                range,
                                errors,
                                changedFieldName,
                                hasBoundaryError,
                                fromFieldName,
                                toFieldName
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