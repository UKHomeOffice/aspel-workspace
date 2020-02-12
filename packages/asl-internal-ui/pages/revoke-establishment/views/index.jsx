import React from 'react';
import { connect } from 'react-redux';
import { Header, Snippet, FormLayout } from '@asl/components';

const Revoke = ({ establishment, children }) => (
  <FormLayout>
    <Header
      title={<Snippet>title</Snippet>}
      subtitle={establishment.name}
    />
    { children }
  </FormLayout>
);

export default connect(({ static: { establishment } }) => ({ establishment }))(Revoke);
