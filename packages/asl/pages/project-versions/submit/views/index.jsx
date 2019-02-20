import React from 'react';
import { connect } from 'react-redux';
import { Snippet, Header, FormLayout } from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';

const Submit = ({ model }) => (
  <FormLayout>
    <Header
      title={<Snippet>title</Snippet>}
      subtitle={model.title || 'Untitled project'}
    />
  </FormLayout>
)

const mapStateToProps = ({ model }) => ({ model });

export default connect(mapStateToProps)(Submit);
