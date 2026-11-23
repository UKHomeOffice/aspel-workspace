import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Types from '../types';

import Input from './input';
import MultipleChoice from '../mixins/multiple-choice';

class Select extends MultipleChoice(Input) {

    render() {
        const options = this.normaliseOptions();
        return <div className={classnames(this.errorClass('govuk-form-group'), this.props.className)}>
            <label className="govuk-label" htmlFor={this.id()}>{this.props.label}</label>
            {
                this.getContentPart('hint')
            }
            {
                this.getContentPart('error', 'govuk-error-message')
            }
            <select
                className={this.errorClass('govuk-select')}
                id={this.id()}
                name={this.props.name}
                {...this.checkedOrUnchecked()}
            >
                {
                    this.props.nullOption && <option value="">{this.props.nullOption}</option> }
                {
                    options.map(opt => (
                        <option
                            value={opt.value}
                            key={opt.value}
                        >{opt.label}</option>
                    ))
                }
            </select>
        </div>;
    }

}

Select.defaultProps = {
    options: [],
    nullOption: 'Select...'
};

Select.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    name: PropTypes.string.isRequired,
    options: Types.options.isRequired,
    onChange: PropTypes.func,
    id: PropTypes.string,
    type: PropTypes.string,
    value: Types.value,
    hint: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    nullOption: PropTypes.string,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object])
};

export default Select;
