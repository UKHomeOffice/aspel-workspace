import React from 'react';
import { useSelector } from 'react-redux';
import { Header, Snippet, FormLayout } from '@asl/components';

export default function CJSM() {
  const establishment = useSelector(state => state.static.establishment);
  return (
    <FormLayout>
      <Header
        title={<Snippet>title</Snippet>}
        subtitle={establishment.name}
      />
    </FormLayout>
  );
}
