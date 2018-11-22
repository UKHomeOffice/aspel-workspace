import React from 'react';
import classnames from 'classnames';

const Panel = ({ title, children, className }) => (
  <div className={classnames('govuk-panel', className)}>
    <h1 className="govuk-panel__title">{ title }</h1>
    <div className="govuk-panel__body">{ children }</div>
  </div>
);

export default Panel;
