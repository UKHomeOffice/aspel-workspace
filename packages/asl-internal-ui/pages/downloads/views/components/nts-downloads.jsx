import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Fieldset } from '@ukhomeoffice/asl-components';
import schema from '../../schema/nts';
const { validateNtsDateRangeQuery } = require('../../lib/nts-date-validation');

export default function NTSDownloads() {
  const initialValidation = useSelector(state => state.static.ntsDateRangeValidation) || {};
  const [errors, setErrors] = useState(initialValidation.errors || {});
  const model = initialValidation.model || {};
  const dateRangeErrors = {
    'date-from': errors['date-from'],
    'date-to': errors['date-to']
  };

  const validateDateRange = values => {
    const validation = validateNtsDateRangeQuery({
      ...values.dateRange,
      ra: 'true'
    });

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

  const validate = event => {
    const query = Object.fromEntries(new FormData(event.currentTarget).entries());
    const validation = validateNtsDateRangeQuery(query);

    if (!validation.isValid) {
      event.preventDefault();
      setErrors(validation.errors);
      return;
    }

    setErrors({});
  };

  return (
    <div className="nts-download-form">
      <form method="GET" action="/downloads/nts/docx" onSubmit={validate}>
        <Fieldset schema={schema.dates} model={model} errors={dateRangeErrors} onChange={validateDateRange} />
        <Fieldset schema={schema.ra} model={model} errors={errors} />
        <button type="submit" className="govuk-button">Download document</button>
      </form>
    </div>
  );
}
