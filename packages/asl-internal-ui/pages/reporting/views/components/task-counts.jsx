import React from 'react';
import { useSelector } from 'react-redux';
import { Snippet, Link } from '@asl/components';
import Number from './number';

const dontLink = [
  'project-change-licence-holder',
  'project-expiry',
  'all-project-change-licence-holder',
  'all-project-expiry',
  'legacy-project-change-licence-holder',
  'legacy-project-expiry'
];

const TaskCounts = ({ types }) => {
  const { tasks } = useSelector(state => state.static);

  return <table className="govuk-table">
    <thead>
      <tr>
        <th>Task type</th>
        <th className="numeric">Total</th>
      </tr>
    </thead>
    <tbody>
      {
        types.map(type => {
          return <tr key={type}>
            <td>
              {
                dontLink.includes(type)
                  ? <Snippet>{ type }</Snippet>
                  : <Link page="reporting.details.filteredTasks" query={{ report: type }} label={<Snippet>{ type }</Snippet>} />
              }
            </td>
            <td className="numeric"><Number number={ tasks[type] || 0 } /></td>
          </tr>;
        })
      }
    </tbody>
  </table>;
};

export default TaskCounts;
