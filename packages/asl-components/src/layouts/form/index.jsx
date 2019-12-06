import React from 'react';
import classnames from 'classnames';
import { ErrorSummary, OpenTaskWarning, Form } from '../../';

const FormLayout = ({
  children,
  className,
  openTasks,
  ...props
}) => (
  <div className={classnames('govuk-grid-row', className)}>
    <div className="govuk-grid-column-two-thirds">
      <OpenTaskWarning openTasks={openTasks} />
      <ErrorSummary />
      {
        children
      }
      <Form {...props} />
    </div>
  </div>
);

export default FormLayout;
