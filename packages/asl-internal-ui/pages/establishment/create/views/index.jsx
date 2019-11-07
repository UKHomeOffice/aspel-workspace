import React, { Fragment } from 'react';
import { FormLayout, Header, Snippet } from '@asl/components';

const Index = () => {
  return (
    <Fragment>
      <FormLayout>
        <Header title={<Snippet>title</Snippet>} />
        <Snippet>summary</Snippet>
      </FormLayout>
      <a href="?clear=true"><Snippet>buttons.cancel</Snippet></a>
    </Fragment>
  );
};

export default Index;
