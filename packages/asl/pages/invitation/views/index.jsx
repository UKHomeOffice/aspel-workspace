import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Inset, Snippet } from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';

const Accept = ({ establishment }) => {
  return <Fragment>
    <header>
      <h2>{establishment.name}</h2>
      <h1><Snippet>title</Snippet></h1>
    </header>
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
