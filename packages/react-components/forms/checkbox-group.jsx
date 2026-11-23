import React, { Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Types from '../types';
import Warning from '../warning';
import Input from './input';
import MultipleChoice from '../mixins/multiple-choice';

const CheckboxItem = ({ disabled, name, value, id, label, warning, hint, reveal, showReveal, revealHidden, ...props }) =>
    <div className="govuk-checkboxes__item">
        {
            disabled && props.checked && <input type="hidden" name={name} value={value}/>
        }
        <input
            className="govuk-checkboxes__input"
            id={id}
            type="checkbox"
            name={name}
            value={value}
            disabled={disabled}
            {...props}
        />
        <label htmlFor={id} className="govuk-label govuk-checkboxes__label">{label}</label>
        {hint && <span className="govuk-hint">{hint}</span>}
        {
            warning &&
            <div className="govuk-reveal">
                <Warning>{warning}</Warning>
            </div>
        }
        {
            reveal && showReveal && (
                <div
                    className={classnames('govuk-reveal', { hidden: revealHidden })}>
                    {reveal}
                </div>
            )
        }
    </div>;

const CheckboxDivider = ({ divider, className = 'govuk-checkboxes__divider' }) =>
    <div className={className}>{divider}</div>;


class CheckboxGroup extends MultipleChoice(Input) {

    componentDidMount() {
        this.setState({});
    }

    optProps(opt) {
        if (this.props.onChange || this.props.disabled) {
            return {
                onChange: this.props.onChange,
                checked: this.hasValue(opt.value)
            };
        }
        return {
            defaultChecked: this.hasValue(opt.value)
        };
    }

    render() {
        const options = this.normaliseOptions();

        const showReveal = opt => {
            if (!this.props.initialHideReveals) {
                return true;
            }

            return this.hasValue(opt.value);
        };

        return <div className={this.errorClass('govuk-form-group')}>
            <fieldset id={this.props.id || this.props.name} className={classnames('govuk-fieldset', { inline: this.props.inline }, this.props.className)}>
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
                <div className="govuk-checkboxes">
                    {
                        options.map(opt => (
                            <Fragment key={this.optionId(opt)}>
                                {
                                    opt.divider
                                        ? <CheckboxDivider {...opt} />
                                        : <CheckboxItem
                                            id={this.optionId(opt)}
                                            name={this.props.name}
                                            showReveal={showReveal(opt)}
                                            revealHidden={!this.props.initialHideReveals && this.state && !this.hasValue(opt.value)}
                                            {...{ ...opt, ...this.optProps(opt) }}
                                        />
                                }
                                { opt.additionalContent }
                            </Fragment>
                        ))
                    }
                </div>
            </fieldset>
        </div>;
    }

}

CheckboxGroup.defaultProps = {
    options: [],
    inline: false
};

CheckboxGroup.propTypes = {
    name: PropTypes.string.isRequired,
    options: Types.options.isRequired,
    initialHideReveals: PropTypes.bool,
    label: PropTypes.node.isRequired,
    onChange: PropTypes.func,
    id: PropTypes.string,
    inline: PropTypes.bool,
    value: PropTypes.oneOfType([Types.value, PropTypes.arrayOf(Types.value)]),
    hint: PropTypes.node,
    error: PropTypes.node
};

export default CheckboxGroup;
