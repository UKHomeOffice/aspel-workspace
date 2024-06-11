import React from 'react';
import { Header, Snippet, FormLayout } from '@ukhomeoffice/asl-components';

function CancelLink() {
  return <a href="?clear=true"><Snippet>buttons.cancel</Snippet></a>;
}

function CreateEnforcementCase() {
  return (
    <FormLayout cancelLink={<CancelLink />}>
      <Header title={<Snippet>page.title</Snippet>} />
    </FormLayout>
  );
}

export default CreateEnforcementCase;
