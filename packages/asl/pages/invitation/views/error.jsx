import React, { Fragment } from 'react';
import { Header } from '@ukhomeoffice/asl-components';

const ErrorPage = () => {
  return <Fragment>
    <Header title="Invitation not found" />
    <p>An invitation matching the provided parameters could not be found. If you were expecting an invitation then you should contact your establishment administrator.</p>
    <p><a href="/" className="govuk-button">Return to homepage</a></p>
  </Fragment>;
};

export default ErrorPage;
