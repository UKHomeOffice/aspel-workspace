import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Header, Snippet, Link } from '@asl/components';
import TaskTable from '@asl/pages/pages/task/list/views/table';

import MetricsFilter from '../../../views/components/metrics-filter';
import InitiatedByFilter from '../../../views/components/initiated-by-filter';
import Metric from '../../../views/components/metric';

export default function Index() {
  const { start, end, establishment } = useSelector(state => state.model);
  const { initiatedBy, metrics, report } = useSelector(state => state.static);

  const tabs = {
    all: 'All tasks',
    external: 'Establishment initiated tasks',
    asru: 'ASRU initiated tasks'
  };

  return (
    <Fragment>
      <Header title={<Snippet>{`title.${report}`}</Snippet>} />

      <Link page="reporting" label={<Snippet>backToMetrics</Snippet>} />

      <MetricsFilter page="reporting.details.filteredTasks" start={start} end={end} establishment={establishment} query={{report}} />
      <InitiatedByFilter page="reporting.details.filteredTasks" tabs={tabs} activeTab={initiatedBy} query={{report}} />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third">
          <Metric number={metrics.total} label={<Snippet>{`title.${report}`}</Snippet>} className="total-tasks" />
        </div>
      </div>

      <TaskTable />
    </Fragment>
  );
}
