import React from 'react';
import { useSelector } from 'react-redux';
import { Header, Link, Metric, Snippet, Tabs } from '@asl/components';

export default function Index() {
  const { year, ropsSummary } = useSelector(state => state.static);

  return (
    <div>
      <Header
        title={<Snippet>title</Snippet>}
        subtitle={<Snippet>subtitle</Snippet>}
      />

      <p><Snippet year={year}>reportingPeriod</Snippet></p>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third">
          <Metric number={ropsSummary.due} label={<Snippet year={year}>ropsSummary.due</Snippet>} className="rops-due" />
        </div>
        <div className="govuk-grid-column-one-third">
          <Metric number={ropsSummary.submitted} label={<Snippet>ropsSummary.submitted</Snippet>} className="rops-submitted" />
        </div>
        <div className="govuk-grid-column-one-third">
          <Metric number={ropsSummary.outstanding} label={<Snippet>ropsSummary.outstanding</Snippet>} className="rops-outstanding" />
        </div>
      </div>

      <Tabs active={0}>
        <Link page="ropsReporting.summary" label="Overview" />
        <Link page="ropsReporting.summary" label="Establishments" />
        <Link page="ropsReporting.download" label="Download" />
      </Tabs>

    </div>
  );
}
