import React from 'react';
import classnames from 'classnames';
import omit from 'lodash/omit';
import Input from './input';
import PropTypes from 'prop-types';

class TextArea extends Input {

    onInput(e) {
        const textarea = e.target;
        textarea.style.height = '';
        textarea.style.height = `${Math.min(textarea.scrollHeight, this.props.maxHeight)}px`;
    }

    render() {
        const { label, name, rows, cols, disabled, readonly, className, autoExpand, autoFocus, ...other } = this.props;

        return <div className={classnames(this.errorClass('govuk-form-group'), className)}>
            <label className="govuk-label" htmlFor={this.id()}>{label}</label>
            {
                this.getContentPart('hint')
            }
            {
                this.getContentPart('error', 'govuk-error-message')
            }
            <textarea
                ref={this.textarea}
                className={this.errorClass('govuk-textarea')}
                id={this.id()}
                name={name}
                rows={rows}
                cols={cols}
                disabled={disabled}
                readOnly={readonly}
                {...omit(other, 'maxHeight', 'dispatch')}
                {...this.checkedOrUnchecked()}
                onInput={autoExpand ? this.onInput.bind(this) : null}
                onFocus={autoExpand ? this.onInput.bind(this) : null}
                autoFocus={autoFocus}
            />
        </div>;
    }

}

TextArea.defaultProps = {
    disabled: false,
    readonly: false,
    autoExpand: false,
    maxHeight: Infinity,
    rows: 4
};

TextArea.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    onChange: PropTypes.func,
    id: PropTypes.string,
    value: PropTypes.string,
    hint: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    cols: PropTypes.number,
    rows: PropTypes.number,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autoExpand: PropTypes.bool
};

export default TextArea;
