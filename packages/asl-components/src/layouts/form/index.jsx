import React from 'react';
import { ErrorSummary, Form } from '../../';

const FormLayout = ({
  children,
  formatters
}) => (
  <div className="govuk-grid-row">
    <div className="govuk-grid-column-two-thirds">
      <ErrorSummary />
      {
        children
      }
      <Form formatters={formatters} />
    </div>
  </div>
);

export default FormLayout;
