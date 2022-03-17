import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Header, Link, Snippet, Metric } from '@asl/components';

import MetricsFilter from '../../../views/components/metrics-filter';

export default function Deadlines() {

  const { start, end, deadlines, internalDeadlines, actions } = useSelector(state => state.model);

  return (
    <Fragment>
      <Header title={<Snippet>title</Snippet>} />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <p>Check which tasks missed one or more internal or external deadlines. ASRU business support users can <Link page="reporting.details.pplSla" label="mark
  statutory deadlines as not missed" /> if there was a valid reason they could not be met.</p>
        </div>
      </div>

      <MetricsFilter start={start} end={end} filterEstablishment={false} />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <Metric number={deadlines} label="Missed statutory deadline" />
        </div>
        <div className="govuk-grid-column-one-half">
          <Metric number={internalDeadlines.total} label="Missed internal target" />
        </div>
      </div>

      <h2>Breakdown of missed internal targets</h2>

      <table className="govuk-table">
        <thead>
          <tr>
            <th>Task type</th>
            <th>Review stage</th>
            <th>Tasks processed</th>
            <th>Tasks with missed internal targets</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>PPL application</td>
            <td>All</td>
            <td>{ actions.application.resubmission + actions.application.first }</td>
            <td>{ internalDeadlines.application.resubmission + internalDeadlines.application.first }</td>
          </tr>
          <tr>
            <td>PPL application</td>
            <td>First</td>
            <td>{ actions.application.first }</td>
            <td>{ internalDeadlines.application.first }</td>
          </tr>
          <tr>
            <td>PPL application</td>
            <td>Subsequent</td>
            <td>{ actions.application.resubmission }</td>
            <td>{ internalDeadlines.application.resubmission }</td>
          </tr>
          <tr>
            <td>PPL amendment</td>
            <td>All</td>
            <td>{ actions.amendment.resubmission + actions.amendment.first }</td>
            <td>{ internalDeadlines.amendment.resubmission + internalDeadlines.amendment.first }</td>
          </tr>
          <tr>
            <td>PPL amendment</td>
            <td>First</td>
            <td>{ actions.amendment.first }</td>
            <td>{ internalDeadlines.amendment.first }</td>
          </tr>
          <tr>
            <td>PPL amendment</td>
            <td>Subsequent</td>
            <td>{ actions.amendment.resubmission }</td>
            <td>{ internalDeadlines.amendment.resubmission }</td>
          </tr>
        </tbody>
      </table>
      <p><Link page="downloads" suffix="#task-metrics" label="Download the a full report of download metrics from the download page" /></p>
    </Fragment>
  );
}
