import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Header, Link, Metric } from '@asl/components';

import MetricsFilter from './components/metrics-filter';

function DateRange() {
  const { start, end } = useSelector(state => {
    return {
      start: moment(state.model.start),
      end: moment(state.model.end)
    };
  });

  if (!start.isSame(end, 'year')) {
    return `From ${start.format('Do MMMM YYYY')} to ${end.format('Do MMMM YYYY')}`;
  }
  if (!start.isSame(end, 'month')) {
    return `From ${start.format('Do MMMM')} to ${end.format('Do MMMM YYYY')}`;
  }
  return `From ${start.format('Do')} to ${end.format('Do MMMM YYYY')}`;
}

export default function Index() {
  const { start, end, tasks, licences, tasksOutstanding, deadlines, internalDeadlines } = useSelector(state => state.model);

  return <Fragment>
    <Header title="Data and performance"/>
    <MetricsFilter page="reporting" start={start} end={end} filterEstablishment={false} />

    <hr/>

    <section>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h2>Tasks completed</h2>
          <p><DateRange /></p>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third">
          <Metric number={tasks.total} label="Tasks completed" className="tasks-completed" />
        </div>
        <div className="govuk-grid-column-one-third">
          <Metric number={tasks.ppls} label="Project licences granted" className="ppls-granted" />
        </div>
        <div className="govuk-grid-column-one-third">
          <Metric number={tasks.iterations / (tasks.ppls || 1)} label="Iterations of project applications" className="ppl-iterations" />
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <p><Link page="reporting.details.completedTasks" label="View more data on completed tasks" /></p>
        </div>
      </div>
    </section>

    <hr/>

    <section>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h2>Tasks with missed deadlines</h2>
          <p><DateRange /></p>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <Metric number={deadlines} label="Missed statutory deadline" className="statutory-deadlines" />
        </div>
        <div className="govuk-grid-column-one-half">
          <Metric number={internalDeadlines.total} label="Missed internal target" className="internal-targets" />
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <p><Link page="reporting.details.deadlines" label="View more data on tasks with missed deadlines" /></p>
        </div>
      </div>
    </section>

    <hr/>

    <section>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h2>Task processing by staff</h2>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <Metric number={tasksOutstanding.total} label="Outstanding tasks" />
        </div>
        <div className="govuk-grid-column-one-half">
          <Metric number={tasksOutstanding.unassigned} label="Unassigned tasks" />
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <p><Link page="asruWorkload" label="View more data on task processing by staff" /></p>
        </div>
      </div>
    </section>

    <hr/>

    <section>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h2>Number of current active licences</h2>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter">
          <Metric number={licences.establishments} label="Establishments" />
        </div>
        <div className="govuk-grid-column-one-quarter">
          <Metric number={licences.projects} label="Projects" />
        </div>
        <div className="govuk-grid-column-one-quarter">
          <Metric number={licences.pils} label="PIL A, B, C, D, F" />
        </div>
        <div className="govuk-grid-column-one-quarter">
          <Metric number={licences.trainingPils} label="PIL E" />
        </div>
      </div>
    </section>

  </Fragment>;
}
