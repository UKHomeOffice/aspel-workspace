import React, { useState, useEffect, useRef } from 'react';
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

function getDateError({ name, field, value, errors = {}, validate = {} }) {
    const errorCode = errors[name];
    if (!errorCode) {
        return null;
    }
    return <DateErrorMessage name={name} value={value} errorCode={errorCode} validate={validate[name] || field.validate} dateLabel={field.dateLabel || field.label} />;
}

function getValue(range, fieldName, key) {
    return range[fieldName] ?? range[key] ?? '';
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

function getRangeError({ name, field, fieldName, value, range, fields, errors, changedFieldName }) {
    const fromField = fields.from || {};
    const fromFieldName = fromField.name || `${name}-from`;
    const toField = fields.to || {};
    const toFieldName = toField.name || `${name}-to`;
    const targetFieldName = changedFieldName === toFieldName ? toFieldName : fromFieldName;

    if (fieldName !== targetFieldName || errors[fromFieldName] || errors[toFieldName]) {
        return null;
    }

    const fromValue = getValue(range, fromFieldName, 'from');
    const fromDate = parseDate(fromValue);
    const toValue = getValue(range, toFieldName, 'to');
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
    name = 'date',
    fields,
    dateRangeFields,
    values,
    errors = {},
    validate = {},
    buttonText = 'Apply filter',
    action,
    method = 'GET',
    asForm = true,
    onChange,
    onSubmit
}) {
    const resolvedValues = values || {};
    const valuesKey = JSON.stringify(resolvedValues);
    const [range, setRange] = useState(resolvedValues);
    const [changedFieldName, setChangedFieldName] = useState(null);
    const emitChange = useRef(false);
    const resolvedFields = dateRangeFields || fields || defaultFields;
    const resolvedLegend = legend || label;

    useEffect(() => {
        setRange(resolvedValues);
    }, [valuesKey]);

    useEffect(() => {
        if (emitChange.current) {
            emitChange.current = false;
            onChange && onChange(range);
        }
    }, [range, onChange]);

    function update(fieldName, value) {
        emitChange.current = true;
        setChangedFieldName(fieldName);
        setRange(previousRange => ({
            ...previousRange,
            [fieldName]: value
        }));
    }

    function submit(e) {
        if (onSubmit) {
            e && e.preventDefault();
            onSubmit(range);
        }
    }

    const Wrapper = asForm ? 'form' : 'div';
    const wrapperProps = asForm
        ? { action, method, onSubmit: submit }
        : {};
    const buttonProps = asForm
        ? { type: 'submit' }
        : { type: 'button', onClick: submit };

    return (
        <Wrapper {...wrapperProps} className="date-range-input">
            <fieldset className="govuk-fieldset">
                {resolvedLegend && (
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                        <h2 className="govuk-fieldset__heading">{resolvedLegend}</h2>
                    </legend>
                )}
                <div className="date-range-input__fields">
                    {
                        Object.keys(resolvedFields).map(key => {
                            const field = resolvedFields[key];
                            const fieldName = field.name || `${name}-${key}`;
                            const value = getValue(range, fieldName, key);
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
                                            name,
                                            key,
                                            field,
                                            fieldName,
                                            value,
                                            range,
                                            fields: resolvedFields,
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
                {buttonText && <button {...buttonProps} className="govuk-button button-secondary">{buttonText}</button>}
            </fieldset>
        </Wrapper>
    );
}