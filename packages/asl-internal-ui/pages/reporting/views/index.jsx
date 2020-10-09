import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Header, Snippet, Link } from '@asl/components';
import { format, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import Metric from './components/metric';

const Index = () => {

  const { since, types, licences, url } = useSelector(state => state.static);

  const [startDate, setStartDate] = useState(since);
  const [loading, setLoading] = useState({});
  const [tasks, setTasks] = useState(types.reduce((obj, type) => ({ ...obj, [type]: '-' }), { total: '-' }));
  const [deadlines, setDeadlines] = useState('-');

  const isLoading = Object.values(loading).some(Boolean);

  const setLoadingParam = (param) => setLoading(loading => ({ ...loading, ...param }));

  useEffect(() => {
    setLoadingParam({ tasks: true });
    fetch(`${url}/tasks?since=${startDate}`)
      .then(response => response.json())
      .then(json => setTasks(json))
      .then(() => setLoadingParam({ tasks: false }));
  }, [startDate]);

  useEffect(() => {
    setLoadingParam({ ppls: true });
    fetch(`${url}/ppl-sla?since=${startDate}`)
      .then(response => response.json())
      .then(json => setDeadlines(json.length))
      .then(() => setLoadingParam({ ppls: false }));
  }, [startDate]);

  useEffect(() => {
    window.history.replaceState(null, '', `?since=${startDate}`);
  }, [startDate]);

  const getMeanIterations = (type) => {
    const iterations = tasks[`${type}-iterations`];
    const count = tasks[type];
    return isNaN(iterations / count) ? '-' : (iterations / count);
  };

  const now = new Date();
  const dates = {
    all: '2019-07-01',
    week: format(startOfWeek(now), 'YYYY-MM-DD'),
    month: format(startOfMonth(now), 'YYYY-MM-DD'),
    year: format(startOfYear(now), 'YYYY-MM-DD')
  };

  const meanIterationsLegacy = getMeanIterations('legacy-project-application');
  const meanIterations = getMeanIterations('project-application');

  const startDateHandler = date => e => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    setStartDate(date);
  };

  return <Fragment>

    <Header title="Performance metrics"/>
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half">
        <Metric number={tasks.total} label="Total tasks completed" />
      </div>
      <div className="govuk-grid-column-one-half">
        <Metric number={deadlines} label="Statutory deadlines passed" />
      </div>
    </div>
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half">
        <Metric number={meanIterationsLegacy} label="Iterations per PPL application (Legacy)" />
      </div>
      <div className="govuk-grid-column-one-half">
        <Metric number={meanIterations} label="Iterations per PPL application (New)" />
      </div>
    </div>

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <div className="table-wrapper">
          <h2>Tasks completed by type:</h2>
          <Link page="reporting.download" query={{since: startDate}} className="download" label="Download this data (.csv)" />
          <table className="govuk-table">
            <tbody>
              {
                types.map(type => {
                  return <tr key={type}>
                    <td><Snippet>{ type }</Snippet></td>
                    <td className="numeric">{ tasks[type] || '0' }</td>
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
              <td>Category A, B, C, D and F PILs</td>
              <td className="numeric">{ licences.pils }</td>
            </tr>
            <tr>
              <td>Category E PILs</td>
              <td className="numeric">{ licences.trainingPils }</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="link-filter">
      {
        isLoading && <p>Loading data...</p>
      }
      {
        !isLoading && <Fragment>
          <label>Showing data for period:</label>
          <ul>
            {
              Object.keys(dates).map(date => {
                return dates[date] === startDate
                  ? <li key={date}><strong><Snippet>{ `date.${date}` }</Snippet></strong></li>
                  : <li key={date}><a href={isLoading ? null : `?since=${dates[date]}`} onClick={startDateHandler(dates[date])}><Snippet>{ `date.${date}` }</Snippet></a></li>;
              })
            }
          </ul>
        </Fragment>
      }
    </div>

  </Fragment>;
};

export default Index;
