import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, ErrorSummary } from '@ukhomeoffice/asl-components';

export default function NTSDownloads() {
  const { schema, errors } = useSelector(state => state.static);
  const model = useSelector(state => state.model);
  const [submitted, setSubmitted] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const handleSubmit = () => {
    setSubmitted(true);
    setDownloadStarted(true);
  };

  return (
    <div id="noResults" className="nts-download-form">
      {!submitted && <ErrorSummary />}
      <Form
        schema={{ dateRange: schema.dateRange, ra: schema.ra }}
        model={model}
        errors={submitted ? {} : errors}
        onChange={() => setDownloadStarted(false)}
        onSubmit={handleSubmit}
        submit={false}
        formProps={{ id: 'form', action: '/downloads?tab=nts' }}
        declaration={
          <button type="submit" className="govuk-button" disabled={downloadStarted}>
            Start download
          </button>
        }
      />
    </div>
  );
}
