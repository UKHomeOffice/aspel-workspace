import React from 'react';
import Input from './input';
import PropTypes from 'prop-types';
import Types from '../types';

const pad = part => {
    part = parseInt(part);
    if (part < 10) {
        part = `0${part}`;
    }
    return part;
};

class DateInput extends Input {

    constructor(options) {
        super(options);
        this.state = {
            value: this.parseValue()
        };
    }

    dateFragment(field) {
        return `${this.id()}-${field}`;
    }

    parseValue() {
        const date = (this.props.value || '').split('T')[0];
        const bits = date.split('-');
        return {
            day: bits[2],
            month: bits[1],
            year: bits[0]
        };
    }

    onChange(key, val) {
        if (!this.props.onChange) {
            return null;
        }
        this.setState({
            value: {
                ...this.state.value,
                [key]: val && val !== '0' ? val : 1
            }
        }, this.emit);
    }

    emit() {
        let { day, month, year } = this.state.value;
        day = pad(day);
        month = pad(month);
        this.props.onChange([year, month, day].join('-'));
    }

    render() {
        const { value } = this.state;
        return <div className={this.errorClass('govuk-form-group')}>
            <fieldset className="govuk-fieldset" aria-describedby={this.dateFragment('hint')} role="group">
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
                            <input className="govuk-input govuk-date-input__input govuk-input--width-2" id={this.dateFragment('day')} name={this.dateFragment('day')} type="number" pattern="[0-9]*" defaultValue={value.day} onChange={e => this.onChange('day', e.target.value)} />
                        </div>
                    </div>
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={this.dateFragment('month')}>
                Month
                            </label>
                            <input className="govuk-input govuk-date-input__input govuk-input--width-2" id={this.dateFragment('month')} name={this.dateFragment('month')} type="number" pattern="[0-9]*" defaultValue={value.month} onChange={e => this.onChange('month', e.target.value)} />
                        </div>
                    </div>
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={this.dateFragment('year')}>
                Year
                            </label>
                            <input className="govuk-input govuk-date-input__input govuk-input--width-4" id={this.dateFragment('year')} name={this.dateFragment('year')} type="number" pattern="[0-9]*" defaultValue={value.year} onChange={e => this.onChange('year', e.target.value)} />
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>;
    }

}

DateInput.defaultProps = {
    value: ''
};

DateInput.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    id: PropTypes.string,
    value: Types.date,
    hint: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

export default DateInput;
