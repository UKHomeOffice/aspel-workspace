import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Header, Link, Metric } from '@asl/components';

import MetricsFilter from './components/metrics-filter';
import InitiatedByFilter from './components/initiated-by-filter';
import TaskCounts from './components/task-counts';

export default function Index() {
  const { start, end, establishment } = useSelector(state => state.model);
  const { licences, deadlines, tasks, initiatedBy } = useSelector(state => state.static);

  const tabs = {
    all: 'All tasks',
    external: 'Establishment initiated tasks',
    asru: 'ASRU initiated tasks'
  };

  const iterationsNew = tasks['project-application-iterations'] / (tasks['project-application'] || 1);

  return <Fragment>
    <Header title="Performance metrics"/>
    <MetricsFilter page="reporting" start={start} end={end} establishment={establishment} />
    <InitiatedByFilter page="reporting" tabs={tabs} activeTab={initiatedBy} />

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-third">
        <Metric number={tasks.total} label="Total tasks completed" className="total-tasks" />
      </div>
      <div className="govuk-grid-column-one-third">
        <Metric number={deadlines} label="Statutory deadlines passed" link="reporting.details.pplSla" className="ppl-deadlines" />
      </div>
      <div className="govuk-grid-column-one-third">
        <Metric number={iterationsNew} label="Iterations per PPL application (New)" className="ppl-iterations-new" />
      </div>
    </div>

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h2>Tasks completed by type:</h2>
      </div>
      <div className="govuk-grid-column-one-third">
        <Link page="reporting.download" query={{ start, end, establishment }} label="Download CSV" className="govuk-button float-right" />
      </div>
      <div className="govuk-grid-column-one-half">
        <h3>All project licence tasks</h3>
        <TaskCounts
          types={[
            'all-project-application',
            'all-project-amendment',
            'all-project-change-licence-holder',
            'all-project-revoke',
            'all-project-expiry',
            'all-project-transfer'
          ]}
        />
        <h3>New project licence tasks</h3>
        <TaskCounts
          types={[
            'project-application',
            'project-amendment',
            'project-change-licence-holder',
            'project-revoke',
            'project-expiry',
            'project-transfer'
          ]}
        />
        <h3>Legacy project licence tasks</h3>
        <TaskCounts
          types={[
            'legacy-project-application',
            'legacy-project-amendment',
            'legacy-project-change-licence-holder',
            'legacy-project-revoke',
            'legacy-project-expiry',
            'legacy-project-transfer'
          ]}
        />
      </div>
      <div className="govuk-grid-column-one-half">
        <h3>ROPs tasks</h3>
        <TaskCounts
          types={[
            'rop-submit'
          ]}
        />
        <h3>Retrospective assessment tasks</h3>
        <TaskCounts
          types={[
            'project-grant-ra'
          ]}
        />
        <h3>Personal licence tasks</h3>
        <TaskCounts
          types={[
            'pil-application',
            'pil-amendment',
            'pil-revoke',
            'pil-transfer',
            'pil-review'
          ]}
        />
        <h3>Establishment licence tasks</h3>
        <TaskCounts
          types={[
            'establishment-application',
            'establishment-revoke',
            'establishment-update',
            'role-create',
            'role-delete',
            'place-update',
            'place-create',
            'place-delete'
          ]}
        />
      </div>
    </div>
    <hr />
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
  </Fragment>;
}
