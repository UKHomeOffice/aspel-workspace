import React, { Fragment } from 'react';
import { FormLayout, Header, Snippet } from '@asl/components';

const Index = () => {
  return (
    <Fragment>
      <FormLayout>
        <Header title={<Snippet>title</Snippet>} />
        <p><Snippet>summary</Snippet></p>
      </FormLayout>
      <a href="?clear=true"><Snippet>buttons.cancel</Snippet></a>
    </Fragment>
  );
};

export default Index;
