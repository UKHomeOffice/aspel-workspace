import React from 'react';
import { useSelector } from 'react-redux';
import { Fieldset } from '@ukhomeoffice/asl-components';
import schema from '../../schema/nts';

export default function NTSDownloads() {
  const { model = {}, errors = {} } = useSelector(state => state.static.ntsDateRangeValidation) || {};

  return (
    <div className="nts-download-form">
      <form method="GET" action="/downloads/nts/docx">
        <Fieldset schema={schema.dates} model={model} errors={errors} />
        <Fieldset schema={schema.ra} model={model} errors={errors} />
        <button type="submit" className="govuk-button">Download document</button>
      </form>
    </div>
  );
}
