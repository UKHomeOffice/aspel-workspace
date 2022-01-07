import React from 'react';
import { useSelector } from 'react-redux';
import { Header, Link, Snippet } from '@asl/components';

export default function Index() {
  const { reports } = useSelector(state => state.static);

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-three-quarters">
        <Header title={<Snippet>page.title</Snippet>} />
        <Snippet>page.description</Snippet>

        {
          reports.map(report => (
            <p key={report.path}>
              <Link
                page="reporting.taskMetrics"
                suffix={report.path}
                label={<Snippet year={report.year} month={report.month}>links.taskMetrics</Snippet>}
              />
            </p>
          ))
        }
      </div>
    </div>
  );
}
