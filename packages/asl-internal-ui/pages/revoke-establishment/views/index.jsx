import React from 'react';
import { connect } from 'react-redux';
import { Header, Snippet, FormLayout } from '@ukhomeoffice/asl-components';
import EstablishmentHeader from '@asl/pages/pages/common/components/establishment-header';

const Revoke = ({ establishment, children }) => (
  <FormLayout>
    <Header
      title={<Snippet>title</Snippet>}
      subtitle={<EstablishmentHeader establishment={establishment}/>}
    />
    { children }
  </FormLayout>
);

export default connect(({ static: { establishment } }) => ({ establishment }))(Revoke);
