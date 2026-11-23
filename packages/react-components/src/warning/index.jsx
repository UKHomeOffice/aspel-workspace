import React from 'react';
import classnames from 'classnames';

const Warning = ({ children, className }) => (
    <div className={classnames('govuk-warning-text', className)}>
        <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
        <strong className="govuk-warning-text__text">
            { children }
        </strong>
    </div>
);

export default Warning;
