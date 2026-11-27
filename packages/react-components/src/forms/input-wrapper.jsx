import React from 'react';
import classnames from 'classnames';
import Input from './input';

class InputWrapper extends Input {

    render() {
        return <div className={classnames(this.errorClass('govuk-form-group'), { disabled: this.props.disabled })}>
            <label className="govuk-label" htmlFor={this.id()}>{this.props.label}</label>
            {
                this.getContentPart('hint')
            }
            {
                this.getContentPart('error', 'govuk-error-message')
            }
            { this.props.children }
        </div>;
    }

}

export default InputWrapper;
