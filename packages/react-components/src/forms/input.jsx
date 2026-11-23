import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const DefaultWrapper = ({ children, type, className, id }) =>
    <span id={id} className={className || `govuk-${type}`}>
        {children}
    </span>;

class Input extends React.Component {

    id() {
        return this.props.id || this.props.name;
    }

    errorClass(cls) {
        return this.props.error ? `${cls} ${cls}--error` : cls;
    }

    checkedOrUnchecked() {
        if (this.props.onChange) {
            return {
                value: this.props.value,
                onChange: this.props.onChange
            };
        }
        return {
            defaultValue: this.props.value
        };
    }

    getContentPart(type, className) {
        if (!this.props[type]) {
            return null;
        }
        const Component = this.props[`${type}Wrapper`] ?? DefaultWrapper;

        return (
            <Component type={type} className={className} id={`${this.id()}-${type}`}>
                {
                    React.isValidElement(this.props[type])
                        ? this.props[type]
                        : <ReactMarkdown>{this.props[type]}</ReactMarkdown>
                }
            </Component>
        );
    }

}

Input.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

export default Input;
