import React, { useState, useEffect } from 'react';
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
    return <DateErrorMessage name={name} value={value} errorCode={errorCode} validate={validate[name] || field.validate} />;
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
                            return (
                                <div className="date-range-input__field" key={key}>
                                    <DateInput
                                        {...field}
                                        name={fieldName}
                                        value={range[fieldName] ?? range[key] ?? ''}
                                        error={getDateError({
                                            name: fieldName,
                                            field,
                                            value: range[fieldName] ?? range[key] ?? '',
                                            errors,
                                            validate
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