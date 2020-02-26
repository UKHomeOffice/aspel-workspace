import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Header, Snippet } from '@asl/components';
import { countBy } from 'lodash';
import { format, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

const Metric = ({ number, label }) => {
  if (number !== Math.floor(number)) {
    try {
      number = number.toFixed(2);
    } catch (e) {
      number = '-';
    }
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
    'project-revoke',
    'pil-application',
    'pil-amendment',
    'pil-revoke',
    'pil-transfer',
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
  const tasks = metrics.tasks;
  const licences = metrics.counts;
  const counts = countBy(tasks, 'type');

  const getMeanIterations = schemaVersion => {
    const pplApplications = tasks.filter(m => m.type === 'project-application')
      .filter(m => m.schemaVersion === schemaVersion);
    const iterations = pplApplications
      .map(m => m.iterations)
      .reduce((sum, i) => sum + i, 0);
    return pplApplications.length ? iterations / pplApplications.length : '-';
  };

  const meanIterationsLegacy = getMeanIterations(0);
  const meanIterations = getMeanIterations(1);

  return <Fragment>

    <Header title="Performance metrics"/>

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-third">
        <Metric number={tasks.length} label="total tasks completed" />
      </div>
      <div className="govuk-grid-column-one-third">
        <Metric number={meanIterationsLegacy} label="iterations per PPL application (Legacy)" />
      </div>
      <div className="govuk-grid-column-one-third">
        <Metric number={meanIterations} label="iterations per PPL application (New)" />
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
                  <td className="numeric">{ counts[type] || '0' }</td>
                </tr>;
              })
            }
          </tbody>
        </table>
      </div>
    </div>

    <h3>Active licences by type:</h3>

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <table className="govuk-table">
          <tbody>
            <tr>
              <td>Establishments</td>
              <td className="numeric">{ licences.establishments }</td>
            </tr>
            <tr>
              <td>Projects</td>
              <td className="numeric">{ licences.projects }</td>
            </tr>
            <tr>
              <td>PILs</td>
              <td className="numeric">{ licences.pils }</td>
            </tr>
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
