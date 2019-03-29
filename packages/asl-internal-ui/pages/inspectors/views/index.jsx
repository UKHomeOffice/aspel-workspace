import React from 'react';
import { connect } from 'react-redux';
import { Snippet, FormLayout, Header } from '@asl/components';

const Page = ({ url, isNamed }) => {
  return (

    <FormLayout>
      <Header title={<Snippet>title</Snippet>}/>
    </FormLayout>

  );
};

const mapStateToProps = ({ static: { url, isNamed } }) => ({ url, isNamed });

export default connect(mapStateToProps)(Page);
