import React, { useState, useEffect } from 'react';
import moment from 'moment';
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

    if (!fromDate.isValid() || !toDate.isValid() || fromDate.isBefore(toDate, 'day')) {
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
    values = {},
    errors = {},
    validate = {},
    buttonText = 'Apply filter',
    action,
    method = 'GET',
    asForm = true,
    onChange,
    onSubmit
}) {
    const [range, setRange] = useState(values);
    const [changedFieldName, setChangedFieldName] = useState(null);
    const resolvedFields = dateRangeFields || fields || defaultFields;
    const resolvedLegend = legend || label;

    useEffect(() => {
        setRange(values);
    }, [values]);

    function update(fieldName, value) {
        const nextRange = {
            ...range,
            [fieldName]: value
        };
        setChangedFieldName(fieldName);
        setRange(nextRange);
        onChange && onChange(nextRange);
    }

    function submit(e) {
        if (onSubmit) {
            e.preventDefault();
            onSubmit(range);
        }
    }

    const Wrapper = asForm ? 'form' : 'div';
    const wrapperProps = asForm
        ? { action, method, onSubmit: submit }
        : {};

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
                {buttonText && <button type="submit" className="govuk-button button-secondary">{buttonText}</button>}
            </fieldset>
        </Wrapper>
    );
}