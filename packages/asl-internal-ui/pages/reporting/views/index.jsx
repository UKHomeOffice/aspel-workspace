import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Header, Snippet } from '@asl/components';
import { countBy } from 'lodash';
import { format, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

const Metric = ({ number, label }) => {
  if (number !== Math.floor(number)) {
    number = number.toFixed(2);
  }
  return <div className="metric">
    <p>{ number }</p>
    <label>{ label }</label>
  </div>
}

const Index = ({ metrics, since }) => {
  const types = [
    'project-application',
    'project-amendment',
    'pil-grant',
    'pil-revoke',
    'role-create',
    'role-delete',
    'place-update',
    'place-create',
    'place-delete',
    'profile-update'
  ];
  const now = new Date();
  const dates = {
    all: '2019-01-01',
    week: format(startOfWeek(now), 'YYYY-MM-DD'),
    month: format(startOfMonth(now), 'YYYY-MM-DD'),
    year: format(startOfYear(now), 'YYYY-MM-DD')
  }
  const counts = countBy(metrics, 'type');
  const pplApplications = metrics.filter(m => m.type === 'project-application');
  const iterations = pplApplications
    .map(m => m.iterations)
    .reduce((sum, i) => sum + i, 0);
  const meanIterations = pplApplications.length ? iterations / pplApplications.length : '-';

  return <Fragment>

    <Header title="Performance metrics"/>

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half">
        <Metric number={metrics.length} label="total tasks completed" />
      </div>
      <div className="govuk-grid-column-one-half">
        <Metric number={meanIterations} label="mean iterations per PPL application" />
      </div>
    </div>

    <h3>Tasks completed by type:</h3>

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <table className="govuk-table">
          <tbody>
            {
              types.map(type => {
                return <tr key={type}>
                  <td><Snippet>{ type }</Snippet></td>
                  <td>{ counts[type] || '0' }</td>
                </tr>;
              })
            }
          </tbody>
        </table>
      </div>
    </div>

    <div className="link-filter">
      <label>Showing data for period:</label>
      <ul>
        {
          Object.keys(dates).map(date => {
            return dates[date] === since ?
              <li key={date}><strong><Snippet>{ `date.${date}` }</Snippet></strong></li> :
              <li key={date}><a href={`?since=${dates[date]}`}><Snippet>{ `date.${date}` }</Snippet></a></li>
          })
        }
      </ul>
    </div>

  </Fragment>
};

export default connect(({ static: { metrics, since } }) => ({ metrics, since }))(Index);
