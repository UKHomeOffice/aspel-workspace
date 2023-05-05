import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Inset, Snippet, Header, Form } from '@ukhomeoffice/asl-components';
import { Button } from '@ukhomeoffice/react-components';

const Accept = ({ establishment }) => {
  return <Fragment>
    <Header title={<Snippet>title</Snippet>} subtitle={establishment.name} />
    <Inset>
      <Snippet>preamble</Snippet>
    </Inset>
    <Form submit={false}>
      <Button type="submit"><Snippet>accept</Snippet></Button>
    </Form>
  </Fragment>;
};

const mapStateToProps = ({ static: { establishment } }) => ({ establishment });

export default connect(mapStateToProps)(Accept);
