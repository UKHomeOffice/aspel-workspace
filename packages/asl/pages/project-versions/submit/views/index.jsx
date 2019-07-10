import React from 'react';
import { connect } from 'react-redux';
import { Snippet, Header, FormLayout } from '@asl/components';
import { Warning } from '@ukhomeoffice/react-components';

const Submit = ({ model }) => {
  const isApplication = model.type === 'application';
  return (
    <FormLayout>
      <Header
        title={<Snippet>title</Snippet>}
        subtitle={model.data.title || 'Untitled project'}
      />
      {isApplication && (
        <Warning>
          <Snippet>warning</Snippet>
        </Warning>
      )}
    </FormLayout>
  );
};

const mapStateToProps = ({ model }) => ({ model });

export default connect(mapStateToProps)(Submit);
