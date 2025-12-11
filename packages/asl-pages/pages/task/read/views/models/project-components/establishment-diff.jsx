import React from 'react';
import { Snippet } from '@ukhomeoffice/asl-components';

export default function EstablishmentDiff({ task }) {
  const isComplete = !task.isOpen;
  const { to, from } = task.data.meta.establishment;
  return (
    <table className="govuk-table compare">
      <thead>
        <tr>
          <th>
            {
              isComplete
                ? <Snippet>establishment.previous</Snippet>
                : <Snippet>establishment.current</Snippet>
            }
          </th>
          <th>
            {
              isComplete
                ? <Snippet>establishment.new</Snippet>
                : <Snippet>establishment.proposed</Snippet>
            }
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{from.name}</td>
          <td><span className="highlight">{to.name}</span></td>
        </tr>
      </tbody>
    </table>
  );
}
