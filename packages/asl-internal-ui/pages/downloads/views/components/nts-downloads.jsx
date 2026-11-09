import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, ErrorSummary } from '@ukhomeoffice/asl-components';
import moment from 'moment';

export default function NTSDownloads() {
  const { schema, errors } = useSelector(state => state.static);
  const model = useSelector(state => state.model);
  const start = moment(model.dateRange?.['date-from'] ?? model['date-from'], ['YYYY-MM-DD', 'YYYY-M-D'], true);
  const formatters = {
    dateRange: {
      renderContext: {
        date: start.isValid() ? start.format('D MMMM YYYY') : ''
      }
    }
  };
  const [submitted, setSubmitted] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const handleSubmit = event => {
    if (downloadStarted) {
      event.preventDefault();
      return;
    }
    setSubmitted(true);
    setDownloadStarted(true);
  };

  return (
    <div id="noResults" className="nts-download-form">
      {!submitted && <ErrorSummary formatters={formatters} />}
      <Form
        schema={{
          dateRange: {
            ...schema.dateRange,
            validate: {
              'date-from': schema['date-from'].validate,
              'date-to': schema['date-to'].validate
            }
          },
          ra: schema.ra
        }}
        model={model}
        errors={submitted ? {} : errors}
        formatters={formatters}
        submit={false}
        formProps={{
          id: 'form',
          action: '/downloads?tab=nts',
          onSubmit: handleSubmit,
          onChange: () => setDownloadStarted(false)
        }}
        declaration={
          <button type="submit" className="govuk-button" disabled={downloadStarted}>
            Start download
          </button>
        }
      />
    </div>
  );
}
