import React from 'react';
import { useSelector } from 'react-redux';
import { Header, Snippet, FormLayout } from '@asl/components';
import EstablishmentHeader from '@asl/pages/pages/common/components/establishment-header';

export default function CJSM() {
  const establishment = useSelector(state => state.static.establishment);
  return (
    <FormLayout>
      <Header
        title={<Snippet>title</Snippet>}
        subtitle={<EstablishmentHeader establishment={establishment}/>}
      />
    </FormLayout>
  );
}
