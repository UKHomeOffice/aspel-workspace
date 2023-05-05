import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Snippet, Header, Form } from '@ukhomeoffice/asl-components';

const ConfirmEmail = () => {

  const { email } = useSelector(state => state.static.profile);

  return <Fragment>
    <Header title={<Snippet>title</Snippet>} />
    <Snippet email={email}>content</Snippet>
    <Form />
  </Fragment>;
};

export default ConfirmEmail;
