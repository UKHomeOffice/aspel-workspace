import React from 'react';
import classnames from 'classnames';
import GovUkDateField from '@govuk-react/date-field';
import { getInvalidDateParts, splitDateValue } from './invalid-parts';
import { describedByIds } from '../aria-describedby';

const DateFieldInput = GovUkDateField.Input;

function DateInput({
    error,
    hint,
    label,
    name,
    onChange = () => {},
    value
}) {
    const hasError = Boolean(error);
    const id = name;
    const dateValue = splitDateValue(value);
    const describedBy = describedByIds(id, { hint, error });
    const invalidParts = hasError ? getInvalidDateParts(dateValue) : [];
    const erroredParts = invalidParts.length ? invalidParts : ['day', 'month', 'year'];

    function dateFragment(part) {
        return `${id}-${part}`;
    }

    function inputClass(part, widthClass) {
        return classnames(
            'govuk-input',
            'govuk-date-input__input',
            widthClass,
            { 'govuk-input--error': hasError && erroredParts.includes(part) }
        );
    }

    function emitDate(parts) {
        const nextValue = splitDateValue(parts);
        const day = nextValue.day.trim();
        const month = nextValue.month.trim();
        const year = nextValue.year.trim();

        if (!day && !month && !year) {
            return '';
        }

        return `${year}-${month}-${day}`;
    }

    return (
        <div className={classnames('govuk-form-group', { 'govuk-form-group--error': hasError })}>
            <fieldset
                className="govuk-fieldset"
                id={id}
                aria-describedby={describedBy}
                role="group"
            >
                {
                    label && (
                        <legend className="govuk-fieldset__legend">
                            <h2 className="govuk-fieldset__heading govuk-heading-l">{label}</h2>
                        </legend>
                    )
                }
                {hint && <div className="govuk-hint" id={`${id}-hint`}>{hint}</div>}
                {error && (
                    <p className="govuk-error-message" id={`${id}-error`}>
                        <span className="govuk-visually-hidden">Error:</span> {error}
                    </p>
                )}
                <DateFieldInput
                    value={dateValue}
                    onChange={parts => onChange(emitDate(parts))}
                    names={{
                        day: dateFragment('day'),
                        month: dateFragment('month'),
                        year: dateFragment('year')
                    }}
                    inputs={{
                        day: {
                            id: dateFragment('day'),
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                            className: inputClass('day', 'govuk-input--width-2'),
                            error: hasError && erroredParts.includes('day')
                        },
                        month: {
                            id: dateFragment('month'),
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                            className: inputClass('month', 'govuk-input--width-2'),
                            error: hasError && erroredParts.includes('month')
                        },
                        year: {
                            id: dateFragment('year'),
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                            className: inputClass('year', 'govuk-input--width-4'),
                            error: hasError && erroredParts.includes('year')
                        }
                    }}
                />
            </fieldset>
        </div>
    );
}

export default DateInput;
