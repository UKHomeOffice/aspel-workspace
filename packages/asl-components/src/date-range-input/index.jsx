import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import DateInput from '../date-input';
import DateErrorMessage from '../date-input/error-message';

const ASPEL_DATA_START_DATE = '2019-07-31';
const DATE_FROM_FIELD_NAME = 'date-from';
const DATE_TO_FIELD_NAME = 'date-to';
const ASPEL_DATA_START = moment(ASPEL_DATA_START_DATE, 'YYYY-MM-DD');

const defaultFields = {
    [DATE_FROM_FIELD_NAME]: {
        label: 'Date from',
        hint: 'For example 01 01 2020'
    },
    [DATE_TO_FIELD_NAME]: {
        label: 'Date to',
        hint: 'For example 12 12 2020'
    }
};

const emptyValues = {};
const RANGE_FIELDS = [DATE_FROM_FIELD_NAME, DATE_TO_FIELD_NAME];

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
    return moment(value, ['YYYY-MM-DD', 'YYYY-M-D'], true);
}

function getBoundaryErrorCode(fieldName, value) {
    const date = parseDate(value);

    if (!date.isValid()) {
        return null;
    }

    if (date.isAfter(moment(), 'day')) {
        return 'dateIsSameOrBefore';
    }

    if (fieldName === DATE_FROM_FIELD_NAME && date.isBefore(ASPEL_DATA_START, 'day')) {
        return 'aspelDataStartDate';
    }

    return null;
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

function getRangeError({ field, fieldName, value, range, errors, changedFieldName, hasBoundaryError }) {
    const targetFieldName = changedFieldName === DATE_TO_FIELD_NAME ? DATE_TO_FIELD_NAME : DATE_FROM_FIELD_NAME;
    const fromValue = range[DATE_FROM_FIELD_NAME] ?? '';
    const toValue = range[DATE_TO_FIELD_NAME] ?? '';

    if (fieldName !== targetFieldName || errors[DATE_FROM_FIELD_NAME] || errors[DATE_TO_FIELD_NAME]) {
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

    const errorCode = targetFieldName === DATE_TO_FIELD_NAME ? 'dateIsAfter' : 'dateIsBefore';
    const constraintValue = targetFieldName === DATE_TO_FIELD_NAME ? fromValue : toValue;

    return <DateErrorMessage name={fieldName} value={value} errorCode={errorCode} validate={[{ [errorCode]: constraintValue }]} dateLabel={getDateLabel(field)} />;
}

export default function DateRangeInput({
    label,
    values,
    errors = {},
    validate = {},
    onChange
}) {
    const [range, setRange] = useState(() => values || emptyValues);
    const [changedFieldName, setChangedFieldName] = useState(null);
    const hasInitialised = useRef(false);
    const fromBoundaryErrorCode = getBoundaryErrorCode(DATE_FROM_FIELD_NAME, range[DATE_FROM_FIELD_NAME] ?? '');
    const toBoundaryErrorCode = getBoundaryErrorCode(DATE_TO_FIELD_NAME, range[DATE_TO_FIELD_NAME] ?? '');
    const hasBoundaryError = Boolean(fromBoundaryErrorCode || toBoundaryErrorCode);

    useEffect(() => {
        if (!hasInitialised.current) {
            hasInitialised.current = true;
            return;
        }
        onChange && onChange(range);
    }, [range, onChange]);

    function update(fieldName, value) {
        setChangedFieldName(fieldName);
        setRange(previousRange => {
            return {
                ...previousRange,
                [fieldName]: value
            };
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
                <div className="date-range-input__fields">
                    {
                        RANGE_FIELDS.map(fieldName => {
                            const field = defaultFields[fieldName];
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
                                errorCode: fieldName === DATE_FROM_FIELD_NAME ? fromBoundaryErrorCode : toBoundaryErrorCode
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