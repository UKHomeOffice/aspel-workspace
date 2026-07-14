import React from 'react';
import { DateInput as BaseDateInput } from '@ukhomeoffice/react-components';
import { getInvalidDateParts } from './invalid-parts';

// ASL-5108 (WCAG 3.3.1 Error Identification): the upstream DateInput hard-codes
// the fieldset's `aria-describedby` to the hint only, so a screen reader entering
// the Day/Month/Year group never hears the error message. We subclass it and
// override only `render()` to:
//   - give the fieldset an `id` matching the field name, and
//   - point `aria-describedby` at BOTH the hint and (when present) the error.
// All value parsing / change / emit behaviour is inherited unchanged, so every
// existing `inputDate` field keeps its exact submit contract (`${name}-day`,
// `${name}-month`, `${name}-year` and the ISO `yyyy-mm-dd` value it emits).
class DateInput extends BaseDateInput {
    describedBy() {
        return [
            this.props.hint ? this.dateFragment('hint') : null,
            this.props.error ? this.dateFragment('error') : null
        ].filter(Boolean).join(' ') || null;
    }

    // Parts to highlight when in error: only the individually-invalid ones, or
    // all three when no single part can be blamed (see invalid-parts.js).
    erroredParts() {
        if (!this.props.error) {
            return [];
        }
        const invalid = getInvalidDateParts(this.state.value);
        return invalid.length ? invalid : ['day', 'month', 'year'];
    }

    inputClass(part, widthClass) {
        const inError = this.erroredParts().includes(part);
        return `govuk-input govuk-date-input__input ${widthClass}${inError ? ' govuk-input--error' : ''}`;
    }

    render() {
        const { value } = this.state;
        return <div className={this.errorClass('govuk-form-group')}>
            <fieldset
                className="govuk-fieldset"
                id={this.id()}
                aria-describedby={this.describedBy()}
                role="group"
            >
                {
                    this.props.label && (
                        <legend className="govuk-fieldset__legend">
                            <h2 className="govuk-fieldset__heading govuk-heading-l">{this.props.label}</h2>
                        </legend>
                    )
                }
                {
                    this.getContentPart('hint')
                }
                {
                    this.getContentPart('error', 'govuk-error-message')
                }
                <div className="govuk-date-input">
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={this.dateFragment('day')}>
                                Day
                            </label>
                            <input className={this.inputClass('day', 'govuk-input--width-2')} id={this.dateFragment('day')} name={this.dateFragment('day')} type="number" pattern="[0-9]*" defaultValue={value.day} onChange={e => this.onChange('day', e.target.value)} />
                        </div>
                    </div>
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={this.dateFragment('month')}>
                                Month
                            </label>
                            <input className={this.inputClass('month', 'govuk-input--width-2')} id={this.dateFragment('month')} name={this.dateFragment('month')} type="number" pattern="[0-9]*" defaultValue={value.month} onChange={e => this.onChange('month', e.target.value)} />
                        </div>
                    </div>
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={this.dateFragment('year')}>
                                Year
                            </label>
                            <input className={this.inputClass('year', 'govuk-input--width-4')} id={this.dateFragment('year')} name={this.dateFragment('year')} type="number" pattern="[0-9]*" defaultValue={value.year} onChange={e => this.onChange('year', e.target.value)} />
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>;
    }
}

export default DateInput;
