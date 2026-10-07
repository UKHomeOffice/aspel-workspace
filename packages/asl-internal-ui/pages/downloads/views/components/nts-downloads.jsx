import React from 'react';
import { useSelector } from 'react-redux';
import { Fieldset, ErrorSummary } from '@ukhomeoffice/asl-components';
import schema from '../../schema/nts';

export default function NTSDownloads() {
  const initialValidation = useSelector(state => state.static.ntsDateRangeValidation) || {};
  const initialNoResults = useSelector(state => state.static.ntsNoResults);
  const errors = initialValidation.errors || {};
  const model = initialValidation.model || {};
  const dateRangeErrors = {
    'date-from': errors['date-from'],
    'date-to': errors['date-to']
  };
  const dateRangeValidate = {
    'date-to': [{ dateIsAfter: model.dateRange?.['date-from'] }]
  };

  return (
    <div className="nts-download-form">
      {initialNoResults && <ErrorSummary />}
      <form method="GET" action="/downloads/nts/docx" noValidate>
        <Fieldset schema={schema.dates} model={model} errors={dateRangeErrors} validate={dateRangeValidate} />
        <Fieldset schema={schema.ra} model={model} errors={errors} />
        <button type="submit" className="govuk-button">Download document</button>
      </form>
    </div>
  );
}
