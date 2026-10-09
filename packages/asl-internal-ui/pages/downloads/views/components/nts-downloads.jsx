import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Fieldset, ErrorSummary } from '@ukhomeoffice/asl-components';
import schema from '../../schema/nts';

export default function NTSDownloads() {
  const initialValidation = useSelector(state => state.static.ntsDateRangeValidation) || {};
  const [submitted, setSubmitted] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const errors = initialValidation.errors || {};
  const model = initialValidation.model || {};
  const displayedErrors = submitted ? {} : errors;
  const dateRangeErrors = {
    dateRange: displayedErrors.dateRange,
    'date-from': displayedErrors['date-from'],
    'date-to': displayedErrors['date-to']
  };
  const dateRangeValidate = {
    'date-to': [{ dateIsAfter: model.dateRange?.['date-from'] }]
  };
  const handleSubmit = () => {
    setSubmitted(true);
    setDownloadStarted(true);
  };
  const handleCriteriaChange = () => setDownloadStarted(false);

  return (
    <div className="nts-download-form">
      {!submitted && <ErrorSummary />}
      <form method="GET" action="/downloads/nts/docx" noValidate onSubmit={handleSubmit}>
        <Fieldset schema={schema.dates} model={model} errors={dateRangeErrors} validate={dateRangeValidate} onChange={handleCriteriaChange} />
        <Fieldset schema={schema.ra} model={model} errors={displayedErrors} onChange={handleCriteriaChange} />
        <button type="submit" className="govuk-button" disabled={downloadStarted}>Download document</button>
      </form>
    </div>
  );
}
