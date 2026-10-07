import React, { useState } from 'react';
import DateInput from '../date-input';
import DateErrorMessage from '../date-input/error-message';

const defaultFields = {
    from: {
        label: 'Date from',
        hint: 'For example 1 6 2026'
    },
    to: {
        label: 'Date to',
        hint: 'For example 30 6 2026'
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

    function update(fieldName, value) {
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
                {hint && <div className="govuk-hint">{hint}</div>}
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