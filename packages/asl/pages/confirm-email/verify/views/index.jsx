import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Snippet, Header, Link } from '@ukhomeoffice/asl-components';
import ErrorPage from './error';

const EmailConfirmed = () => {

  const error = useSelector(state => state.static.verificationError);

  if (error) {
    return <ErrorPage />;
  }

  return <Fragment>
    <Header title={<Snippet>title</Snippet>} />
    <Snippet>content</Snippet>
    <p>
      <Link page="dashboard" className="govuk-button" label={<Snippet>buttons.continue</Snippet>} />
    </p>
  </Fragment>;
};

export default EmailConfirmed;
