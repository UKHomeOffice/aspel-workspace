import React from 'react';
import { Fieldset, Form } from '@ukhomeoffice/asl-components';
import schema from '../../schema/nts';

function NTSFormFields({ formFields }) {
  return (
    <>
      {formFields}
      <Fieldset schema={schema.ra} model={{}} />
      <button type="submit" className="govuk-button">Download document</button>
    </>
  );
}

export default function NTSDownloads() {
  return (
    <div className="nts-download-form">
      <h2>Filter by date granted</h2>
      <p className="govuk-hint">You can only download data from 31 July 2019, when ASPeL came into use</p>

      <Form
        schema={schema.dates}
        model={{}}
        submit={false}
        detachFields
        formProps={{ method: 'GET', action: '/downloads/nts/docx' }}
      >
        <NTSFormFields />
      </Form>
    </div>
  );
}
