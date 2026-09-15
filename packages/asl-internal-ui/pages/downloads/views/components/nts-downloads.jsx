import React from 'react';
import { Fieldset } from '@ukhomeoffice/asl-components';
import schema from '../../schema/nts';

export default function NTSDownloads() {
  return (
    <div className="nts-download-form">
      <form method="GET" action="/downloads/nts/docx">
        <Fieldset schema={schema.dates} model={{}} />
        <Fieldset schema={schema.ra} model={{}} />
        <button type="submit" className="govuk-button">Download document</button>
      </form>
    </div>
  );
}
