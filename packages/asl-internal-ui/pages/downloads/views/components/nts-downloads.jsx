import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Fieldset, ErrorSummary } from '@ukhomeoffice/asl-components';
import schema from '../../schema/nts';
const { validateNtsDateRangeQuery } = require('../../lib/nts-date-validation');

export default function NTSDownloads() {
  const initialValidation = useSelector(state => state.static.ntsDateRangeValidation) || {};
  const initialNoResults = useSelector(state => state.static.ntsNoResults);
  const [errors, setErrors] = useState(initialValidation.errors || {});
  const [downloadStarted, setDownloadStarted] = useState(false);
  const model = initialValidation.model || {};
  const dateRangeErrors = {
    'date-from': errors['date-from'],
    'date-to': errors['date-to']
  };

  const validateDateRange = values => {
    // Fieldset also fires onChange once on mount with the unchanged initial values - ignore that call
    if (values.dateRange?.['date-from'] === model.dateRange?.['date-from'] &&
      values.dateRange?.['date-to'] === model.dateRange?.['date-to']) {
      return;
    }

    const validation = validateNtsDateRangeQuery({
      ...values.dateRange,
      ra: 'true'
    });

    setDownloadStarted(false);
    setErrors(currentErrors => {
      const nextErrors = { ...currentErrors };

      if (validation.errors['date-to'] === 'maximumDateRange') {
        nextErrors['date-to'] = 'maximumDateRange';
      } else if (nextErrors['date-to'] === 'maximumDateRange') {
        delete nextErrors['date-to'];
      }

      return nextErrors;
    });
  };

  const handleRaChange = values => {
    // Fieldset also fires onChange once on mount with the unchanged initial value - ignore that call
    if (values.ra === model.ra) {
      return;
    }

    setDownloadStarted(false);
  };

  const validate = event => {
    const query = Object.fromEntries(new FormData(event.currentTarget).entries());
    const validation = validateNtsDateRangeQuery(query);

    if (!validation.isValid) {
      event.preventDefault();
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setDownloadStarted(true);
  };

  return (
    <div className="nts-download-form">
      {initialNoResults && <ErrorSummary />}
      <form method="GET" action="/downloads/nts/docx" onSubmit={validate}>
        <Fieldset schema={schema.dates} model={model} errors={dateRangeErrors} onChange={validateDateRange} />
        <Fieldset schema={schema.ra} model={model} errors={errors} onChange={handleRaChange} />
        <button type="submit" className="govuk-button" disabled={downloadStarted}>Download document</button>
      </form>
    </div>
  );
}
