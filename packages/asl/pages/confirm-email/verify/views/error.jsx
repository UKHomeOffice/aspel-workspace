import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Snippet, Header, Form } from '@ukhomeoffice/asl-components';

const ConfirmError = () => {

  const { email } = useSelector(state => state.static.profile);

  return <Fragment>
    <Header title={<Snippet>error.title</Snippet>} />
    <Snippet email={email}>error.content</Snippet>
    <Form />
  </Fragment>;
};

export default ConfirmError;
