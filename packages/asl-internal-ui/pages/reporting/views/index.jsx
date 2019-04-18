import React, { Fragment } from 'react';
import { Header } from '@asl/components';

const Index = () => (
  <Fragment>
    <Header title="Reports" />

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h2>NTS Summaries</h2>
        <p><a href="/reporting/2017" className="govuk-button">2017</a></p>
        <p><a href="/reporting/2018" className="govuk-button">2018</a></p>
      </div>
    </div>

  </Fragment>
);

export default Index;
