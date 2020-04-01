import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Header, Snippet, CSVDownloadLink } from '@asl/components';
import countBy from 'lodash/countBy';
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

const Index = ({ metrics, since, types }) => {

  const now = new Date();
  const dates = {
    all: '2019-07-01',
    week: format(startOfWeek(now), 'YYYY-MM-DD'),
    month: format(startOfMonth(now), 'YYYY-MM-DD'),
    year: format(startOfYear(now), 'YYYY-MM-DD')
  }
  const tasks = metrics.tasks;
  const licences = metrics.counts;
  const counts = countBy(tasks, 'type');
  const pplApplications = tasks.filter(m => m.type === 'project-application')

  const getMeanIterations = schemaVersion => {
    const applications = pplApplications.filter(m => m.schemaVersion === schemaVersion);
    const iterations = applications
      .map(m => m.iterations)
      .reduce((sum, i) => sum + i, 0);
    return applications.length ? iterations / applications.length : '-';
  };

  const meanIterationsLegacy = getMeanIterations(0);
  const meanIterations = getMeanIterations(1);

  return <Fragment>

    <Header title="Performance metrics"/>

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half">
        <Metric number={tasks.length} label="total tasks completed" />
      </div>
      <div className="govuk-grid-column-one-half">
        <Metric number={metrics.projectsOutsideSLA} label="PPL applications outside SLA" />
      </div>
    </div>
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half">
        <Metric number={meanIterationsLegacy} label="iterations per PPL application (Legacy)" />
      </div>
      <div className="govuk-grid-column-one-half">
        <Metric number={meanIterations} label="iterations per PPL application (New)" />
      </div>
    </div>

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <div className="table-wrapper">
          <h2>Tasks completed by type:</h2>
          <CSVDownloadLink query={{ since }} />
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
    </div>


    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h2>Active licences by type:</h2>
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

export default connect(({ static: { metrics, since, types } }) => ({ metrics, since, types }))(Index);
