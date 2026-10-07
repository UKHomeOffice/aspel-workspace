import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Fieldset, ErrorSummary } from '@ukhomeoffice/asl-components';
import schema from '../../schema/nts';

export default function NTSDownloads() {
  const initialValidation = useSelector(state => state.static.ntsDateRangeValidation) || {};
  const [submitted, setSubmitted] = useState(false);
  const errors = initialValidation.errors || {};
  const model = initialValidation.model || {};
  const displayedErrors = submitted ? {} : errors;
  const dateRangeErrors = {
    'date-from': displayedErrors['date-from'],
    'date-to': displayedErrors['date-to']
  };
  const dateRangeValidate = {
    'date-to': [{ dateIsAfter: model.dateRange?.['date-from'] }]
  };

  return (
    <div className="nts-download-form">
      {!submitted && <ErrorSummary />}
      <form method="GET" action="/downloads/nts/docx" noValidate onSubmit={() => setSubmitted(true)}>
        <Fieldset schema={schema.dates} model={model} errors={dateRangeErrors} validate={dateRangeValidate} />
        <Fieldset schema={schema.ra} model={model} errors={displayedErrors} />
        <button type="submit" className="govuk-button">Download document</button>
      </form>
    </div>
  );
}
