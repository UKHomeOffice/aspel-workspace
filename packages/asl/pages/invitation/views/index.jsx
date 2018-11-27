import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Inset, Snippet, Header } from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';

const Accept = ({ establishment }) => {
  return <Fragment>
    <Header title={<Snippet>title</Snippet>} subtitle={establishment.name} />
    <Inset>
      <Snippet>preamble</Snippet>
    </Inset>
    <form method="post" action="">
      <Button type="submit"><Snippet>accept</Snippet></Button>
    </form>
  </Fragment>
}

const mapStateToProps = ({ static: { establishment } }) => ({ establishment });

export default connect(mapStateToProps)(Accept);
