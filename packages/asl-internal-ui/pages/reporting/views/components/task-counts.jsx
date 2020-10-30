import React from 'react';
import { useSelector } from 'react-redux';
import { Snippet } from '@asl/components';

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
            <td><Snippet>{ type }</Snippet></td>
            <td className="numeric">{ tasks[type] || '0' }</td>
          </tr>;
        })
      }
    </tbody>
  </table>
};

export default TaskCounts;
