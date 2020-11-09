import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Header, Form, Snippet } from '@asl/components';

import Metric from './components/metric';
import TaskCounts from './components/task-counts';
import DatePicker from './components/date-picker';
import EstablishmentSelect from './components/establishment-select';

const Index = () => {

  const {
    licences,
    deadlines,
    tasks
  } = useSelector(state => state.static);

  const {
    start,
    end,
    establishment
  } = useSelector(state => state.model);

  const iterationsNew = tasks['project-application-iterations'] / (tasks['project-application'] || 1);
  const iterationsLegacy = tasks['legacy-project-application-iterations'] / (tasks['legacy-project-application'] || 1);

  return <Fragment>
    <Header title="Performance metrics"/>
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <Form detachFields={true} className="metrics-filters">
          <p>
            Showing data <label htmlFor="start">from</label>:
            <DatePicker
              name="start"
              title="Start date"
              maxDate={new Date()}
              minDate={new Date(2019, 6, 31)}
              date={start}
            />
            <label htmlFor="end">to</label>
            <DatePicker
              name="end"
              title="End date"
              maxDate={new Date()}
              minDate={new Date(2019, 6, 31)}
              date={end}
            />
          </p>
          <p>
            <label htmlFor="establishment">
              Filter by establishment:
              <EstablishmentSelect
                className="inline"
                name="establishment"
                value={establishment}
              />
            </label>
            {
              establishment && <a href="?establishment=all">Show all establishments</a>
            }
          </p>
          <p className="control-panel">
            <button type="submit" className="govuk-button"><Snippet>buttons.submit</Snippet></button>
          </p>
        </Form>
      </div>
    </div>
    <hr />
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-quarter">
        <Metric number={tasks.total} label="Total tasks completed" className="total-tasks" />
      </div>
      <div className="govuk-grid-column-one-quarter">
        <Metric number={deadlines} label="Statutory deadlines passed" link="reporting.details.pplSla" className="ppl-deadlines" />
      </div>
      <div className="govuk-grid-column-one-quarter">
        <Metric number={iterationsLegacy} label="Iterations per PPL application (Legacy)" className="ppl-iterations-legacy" />
      </div>
      <div className="govuk-grid-column-one-quarter">
        <Metric number={iterationsNew} label="Iterations per PPL application (New)" className="ppl-iterations-new" />
      </div>
    </div>

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h2>Tasks completed by type:</h2>
      </div>
      <div className="govuk-grid-column-one-half">
        <h3>All project licence tasks</h3>
        <TaskCounts
          types={[
            'all-project-application',
            'all-project-amendment',
            'all-project-revoke',
            'all-project-transfer'
          ]}
        />
        <h3>New project licence tasks</h3>
        <TaskCounts
          types={[
            'project-application',
            'project-amendment',
            'project-revoke',
            'project-transfer'
          ]}
        />
        <h3>Legacy project licence tasks</h3>
        <TaskCounts
          types={[
            'legacy-project-application',
            'legacy-project-amendment',
            'legacy-project-revoke',
            'legacy-project-transfer'
          ]}
        />
      </div>
      <div className="govuk-grid-column-one-half">
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
            'establishment-grant',
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
};

export default Index;
