import React from 'react';
import { useSelector } from 'react-redux';
import { ExpiryDate, Header, Link, Metric, Snippet, Tabs } from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';

const Export = ({ id, profile, ready, updatedAt, meta = {} }) => {
  return <tr>
    <td>
      <ExpiryDate
        date={updatedAt}
        dateFormat="D MMM YYYY, HH:mm"
        showNotice={false}
      />
    </td>
    <td>
      <Link page="globalProfile" profileId={profile.id} label={`${profile.firstName} ${profile.lastName}`} />
    </td>
    <td>
      {
        ready && meta ? meta.due : '-'
      }
    </td>
    <td>
      {
        ready && meta ? meta.submitted : '-'
      }
    </td>
    <td>
      {
        ready && meta ? (meta.due - meta.submitted) : '-'
      }
    </td>
    <td>
      {
        ready ? <Link page="ropsReporting.download.export" exportId={id} label="Download" /> : 'Pending'
      }
    </td>
  </tr>
};

const RopsList = () => {
  const rows = useSelector(state => state.model);


  return <table className="govuk-table">
    <thead>
      <tr>
        <th>Downloaded on</th>
        <th>Downloaded by</th>
        <th>Total returns</th>
        <th>Submitted returns</th>
        <th>Outstanding returns</th>
        <th>Download</th>
      </tr>
    </thead>
    <tbody>
      {
        rows.length ? rows.map(row => <Export {...row} key={row.id} />) : <td colSpan={6}>No returns downloaded yet</td>
      }
    </tbody>
  </table>;
};

export default function Index() {
  const { year, ropsSummary } = useSelector(state => state.static);
  const rows = useSelector(state => state.model);
  const hasPendingDownload = !!rows.some(row => !row.ready);

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

      <Tabs active={2}>
        <Link page="ropsReporting.summary" label="Overview" />
        <Link page="ropsReporting.summary" label="Establishments" />
        <Link page="ropsReporting.download" label="Download returns" />
      </Tabs>

      <h2>Download returns</h2>
      <form action="" method="post">
        <Button type="Submit" disabled={hasPendingDownload}>Download returns</Button>
      </form>

      <h2>Previous downloads</h2>

      <RopsList />

    </div>
  );
}
