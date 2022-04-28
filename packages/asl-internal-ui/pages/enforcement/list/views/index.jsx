import React, { Fragment } from 'react';
import size from 'lodash/size';
import { Header, Snippet, Datatable, Link } from '@asl/components';
import formatters from '../formatters';

function EnforcementCase({ row, schema }) {
  const flags = row.subjects.reduce((flags, subject) => {
    subject.flags.map(flag => {
      flag.profile = flag.profile || subject.profile;
      flags.push(flag);
    });
    return flags;
  }, []);
  const firstFlag = flags[0];

  if (flags.length === 0) {
    return (
      <tr>
        <td>{row.caseNumber}</td>
        <td colSpan={size(schema) - 2}><em><Snippet>cases.flags.empty</Snippet></em></td>
        <td><Link page="enforcement.update" caseId={row.id} label={<Snippet>cases.actions.view</Snippet>} /></td>
      </tr>
    );
  }

  return (
    <Fragment>
      <tr>
        <td rowSpan={flags.length}>{row.caseNumber}</td>
        <td>{formatters.subject.format(firstFlag)}</td>
        <td>{formatters.establishment.format(firstFlag)}</td>
        <td>{formatters.appliedTo.format(firstFlag)}</td>
        <td>{formatters.status.format(firstFlag)}</td>
        <td>{formatters.date.format(firstFlag.createdAt)}</td>
        <td>{formatters.date.format(firstFlag.updatedAt)}</td>
        <td rowSpan={flags.length}><Link page="enforcement.update" caseId={row.id} label={<Snippet>cases.actions.view</Snippet>} /></td>
      </tr>
      {
        flags.slice(1).map(flag => (
          <tr key={flag.id}>
            <td>{formatters.subject.format(flag)}</td>
            <td>{formatters.establishment.format(flag)}</td>
            <td>{formatters.appliedTo.format(flag)}</td>
            <td>{formatters.status.format(flag)}</td>
            <td>{formatters.date.format(flag.createdAt)}</td>
            <td>{formatters.date.format(flag.updatedAt)}</td>
          </tr>
        ))
      }
    </Fragment>
  );
}

function List() {
  return (
    <div className="enforcement-cases">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Header title={<Snippet>page.title</Snippet>} />
          <p><Snippet>page.description</Snippet></p>
        </div>
      </div>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-three-quarters">
          <h2>All cases</h2>
        </div>
        <div className="govuk-grid-column-one-quarter">
          <Link page="enforcement.create" label={<Snippet>cases.actions.create</Snippet>} className="govuk-button float-right" />
        </div>
      </div>

      <Datatable CustomRow={EnforcementCase} alwaysExpanded={true} />
    </div>
  );
}

export default List;
