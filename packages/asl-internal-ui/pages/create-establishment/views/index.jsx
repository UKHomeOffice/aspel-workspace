import React, { Fragment } from 'react';
import { FormLayout, Header, Snippet } from '@asl/components';

const CancelLink = () => {
  return <a href="?clear=true"><Snippet>buttons.cancel</Snippet></a>;
};

const Index = () => {
  return (
    <Fragment>
      <FormLayout cancelLink={<CancelLink />}>
        <Header title={<Snippet>title</Snippet>} />
        <p><Snippet>summary</Snippet></p>
      </FormLayout>
    </Fragment>
  );
};

export default Index;
