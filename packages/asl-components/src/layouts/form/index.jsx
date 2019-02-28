import React from 'react';
import { ErrorSummary, Form } from '../../';

const FormLayout = ({
  children,
  ...props
}) => (
  <div className="govuk-grid-row">
    <div className="govuk-grid-column-two-thirds">
      <ErrorSummary />
      {
        children
      }
      <Form {...props} />
    </div>
  </div>
);

export default FormLayout;
