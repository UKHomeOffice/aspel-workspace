import React from 'react';
import { useSelector } from 'react-redux';
import { Datatable, Snippet, Metric } from '@asl/components';
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
          <Metric label={<Snippet>metrics.notExempt</Snippet>} number={metrics.notExempt} className="missed" />
        </div>
        <div className="govuk-grid-column-one-third">
          <Metric label={<Snippet>metrics.exempt</Snippet>} number={metrics.exempt} className="not-missed" />
        </div>
      </div>

      <Datatable formatters={formatters} Expandable={ExpandableRow} />

    </div>
  );
}
