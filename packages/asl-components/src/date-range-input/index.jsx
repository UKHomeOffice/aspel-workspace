import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DateInput from '../date-input';
import DateErrorMessage from '../date-input/error-message';

const ASPEL_DATA_START_DATE = '2019-07-31';

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
const DATE_FROM_FIELD_NAME = 'date-from';
const DATE_TO_FIELD_NAME = 'date-to';
const RANGE_FIELDS = [
    { key: 'from', fieldName: DATE_FROM_FIELD_NAME },
    { key: 'to', fieldName: DATE_TO_FIELD_NAME }
];

function getDateError({ name, field, value, errors = {}, validate = {} }) {
    const errorCode = errors[name];
    if (!errorCode) {
        return null;
    }
    return <DateErrorMessage name={name} value={value} errorCode={errorCode} validate={validate[name] || field.validate} dateLabel={field.dateLabel || field.label} />;
}

function parseDate(value) {
    return moment(value, ['YYYY-MM-DD', 'YYYY-M-D'], true);
}

function getBoundaryError({ key, field, fieldName, value }) {
    const date = parseDate(value);

    if (!date.isValid()) {
        return null;
    }

    if (date.isAfter(moment(), 'day')) {
        return <DateErrorMessage name={fieldName} value={value} errorCode="dateIsSameOrBefore" validate={[{ dateIsSameOrBefore: 'now' }]} dateLabel={field.dateLabel || field.label} />;
    }

    if (key === 'from' && date.isBefore(moment(ASPEL_DATA_START_DATE, 'YYYY-MM-DD'), 'day')) {
        return <DateErrorMessage name={fieldName} value={value} errorCode="aspelDataStartDate" dateLabel={field.dateLabel || field.label} />;
    }

    return null;
}

function getRangeError({ field, fieldName, value, range, errors, changedFieldName }) {
    const fromFieldName = DATE_FROM_FIELD_NAME;
    const toFieldName = DATE_TO_FIELD_NAME;
    const targetFieldName = changedFieldName === toFieldName ? toFieldName : fromFieldName;

    if (fieldName !== targetFieldName || errors[fromFieldName] || errors[toFieldName]) {
        return null;
    }

    const fromValue = range[fromFieldName] ?? '';
    const fromDate = parseDate(fromValue);
    const toValue = range[toFieldName] ?? '';
    const toDate = parseDate(toValue);

    if (!fromDate.isValid() || !toDate.isValid() || fromDate.isSameOrBefore(toDate, 'day')) {
        return null;
    }

    const errorCode = targetFieldName === toFieldName ? 'dateIsAfter' : 'dateIsBefore';
    const constraintValue = targetFieldName === toFieldName ? fromValue : toValue;

    return <DateErrorMessage name={fieldName} value={value} errorCode={errorCode} validate={[{ [errorCode]: constraintValue }]} dateLabel={field.dateLabel || field.label} />;
}

export default function DateRangeInput({
    legend,
    label,
    fields,
    dateRangeFields,
    values,
    errors = {},
    validate = {},
    onChange
}) {
    const resolvedValues = values || emptyValues;
    const [range, setRange] = useState(resolvedValues);
    const [changedFieldName, setChangedFieldName] = useState(null);
    const resolvedFields = dateRangeFields || fields || defaultFields;
    const resolvedLegend = legend || label;

    useEffect(() => {
        setRange(resolvedValues);
    }, [resolvedValues]);

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
                {resolvedLegend && (
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                        <h2 className="govuk-fieldset__heading">{resolvedLegend}</h2>
                    </legend>
                )}
                <div className="date-range-input__fields">
                    {
                        RANGE_FIELDS.map(({ key, fieldName }) => {
                            const field = resolvedFields[key] || defaultFields[key];
                            const value = range[fieldName] ?? '';
                            return (
                                <div className="date-range-input__field" key={key}>
                                    <DateInput
                                        {...field}
                                        name={fieldName}
                                        value={value}
                                        error={getDateError({
                                            name: fieldName,
                                            field,
                                            value,
                                            errors,
                                            validate
                                        }) || getBoundaryError({
                                            key,
                                            field,
                                            fieldName,
                                            value
                                        }) || getRangeError({
                                            field,
                                            fieldName,
                                            value,
                                            range,
                                            errors,
                                            changedFieldName
                                        })}
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