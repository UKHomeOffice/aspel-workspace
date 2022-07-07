import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { Header, Link, Snippet, Metric } from '@asl/components';
import { Warning } from '@ukhomeoffice/react-components';
import format from 'date-fns/format';

import MetricsFilter from '../../../views/components/metrics-filter';

export default function Deadlines() {

  const { start, end, deadlines, internalDeadlines, actions } = useSelector(state => state.model);

  const [startDate, setStartDate] = useState(new Date(start));

  return (
    <Fragment>
      <Header title={<Snippet>title</Snippet>} />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <p>Check which tasks missed one or more internal or external deadlines. ASRU business support users can <Link page="reporting.details.pplSla" label="mark
  statutory deadlines as not missed" /> if there was a valid reason they could not be met.</p>
        </div>
      </div>

      <MetricsFilter start={startDate} end={end} filterEstablishment={false} setStartDate={setStartDate} />
      {
        format(startDate, 'YYYY-MM-DD') < '2022-04-01' ? <Warning>Missed internal deadline data is not available before 1 April 2022</Warning> : ''
      }

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <Metric number={deadlines} label="Missed statutory deadline" />
        </div>
        <div className="govuk-grid-column-one-half">
          {
            end < '2022-02-01' ? <div className="metric">
              <p>No data</p>
              <label>Missed internal target</label>
            </div> : <Metric number={internalDeadlines.total} label="Missed internal target" />
          }
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
            {
              end < '2022-02-01' ? <td>No data</td> : <td>{ internalDeadlines.application.resubmission + internalDeadlines.application.first }</td>
            }
          </tr>
          <tr>
            <td>PPL application</td>
            <td>First</td>
            <td>{ actions.application.first }</td>
            {
              end < '2022-02-01' ? <td>No data</td> : <td>{ internalDeadlines.application.first }</td>
            }
          </tr>
          <tr>
            <td>PPL application</td>
            <td>Subsequent</td>
            <td>{ actions.application.resubmission }</td>
            {
              end < '2022-02-01' ? <td>No data</td> : <td>{ internalDeadlines.application.resubmission }</td>
            }
          </tr>
          <tr>
            <td>PPL amendment</td>
            <td>All</td>
            <td>{ actions.amendment.resubmission + actions.amendment.first }</td>
            {
              end < '2022-02-01' ? <td>No data</td> : <td>{ internalDeadlines.amendment.resubmission + internalDeadlines.amendment.first }</td>
            }
          </tr>
          <tr>
            <td>PPL amendment</td>
            <td>First</td>
            <td>{ actions.amendment.first }</td>
            {
              end < '2022-02-01' ? <td>No data</td> : <td>{ internalDeadlines.amendment.first }</td>
            }
          </tr>
          <tr>
            <td>PPL amendment</td>
            <td>Subsequent</td>
            <td>{ actions.amendment.resubmission }</td>
            {
              end < '2022-02-01' ? <td>No data</td> : <td>{ internalDeadlines.amendment.resubmission }</td>
            }
          </tr>
        </tbody>
      </table>
      <p><Link page="downloads" suffix="#task-metrics" label="Download a full report of missed internal targets from the download page" /></p>
    </Fragment>
  );
}
