import React, { Fragment } from 'react';

const ErrorPage = () => {
  return <Fragment>
    <header>
      <h2>&nbsp;</h2>
      <h1>Invitaton not found</h1>
    </header>
    <p>An invitation matching the provided parameters could not be found. If you were expecting an invitation then you should contact your establishment administrator.</p>
    <p><a href="/" className="govuk-button">Return to homepage</a></p>
  </Fragment>
}

export default ErrorPage;
