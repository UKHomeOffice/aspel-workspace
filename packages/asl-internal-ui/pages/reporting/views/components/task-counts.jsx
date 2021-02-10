import React from 'react';
import { useSelector } from 'react-redux';
import { Snippet, Link } from '@asl/components';
import Number from './number';

// whitelist for now, switch to nopes once most of them are tested
const linkToTasks = [
  'project-application',
  'all-project-application',
  'legacy-project-application',
  'project-amendment',
  'all-project-amendment',
  'legacy-project-amendment',
  'pil-application',
  'pil-amendment'
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
                linkToTasks.includes(type)
                  ? <Link page="reporting.details.filteredTasks" query={{ report: type }} label={<Snippet>{ type }</Snippet>} />
                  : <Snippet>{ type }</Snippet>
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
