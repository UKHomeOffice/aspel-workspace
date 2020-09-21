import React from 'react';
import { useSelector } from 'react-redux';
import { Datatable, Snippet } from '@asl/components';
import Metric from '../../../views/components/metric';
import formatters from './formatters';
import ExpandableRow from './row';

export default function PplSla() {
  const { metrics } = useSelector(state => state.static);

  return (
    <div className="metrics-ppl-sla">

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1><Snippet>title</Snippet></h1>
          <p><Snippet>summary</Snippet></p>
        </div>
      </div>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third">
          <Metric label={<Snippet>metrics.passed</Snippet>} number={metrics.passed} className="passed" />
        </div>
        <div className="govuk-grid-column-one-third">
          <Metric label={<Snippet>metrics.missed</Snippet>} number={metrics.missed} className="missed" />
        </div>
        <div className="govuk-grid-column-one-third">
          <Metric label={<Snippet>metrics.notMissed</Snippet>} number={metrics.notMissed} className="not-missed" />
        </div>
      </div>

      <Datatable formatters={formatters} Expandable={ExpandableRow} />

    </div>
  );
}
