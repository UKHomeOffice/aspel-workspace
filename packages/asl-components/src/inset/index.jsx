import React from 'react';
import classnames from 'classnames';

const Inset = ({
  children,
  className,
  ...props
}) => (
  <div className={classnames('govuk-inset-text', className)} {...props}>
    {children}
  </div>
);

export default Inset;
