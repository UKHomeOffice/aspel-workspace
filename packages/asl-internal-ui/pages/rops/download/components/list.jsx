import React from 'react';
import { useSelector } from 'react-redux';
import { Snippet } from '@asl/components';

const Row = ({ schema, row }) => {
  return <tr>
    {
      Object.keys(schema).map(key => (
        <td className={key} key={key}>
          {
            schema[key].format ? schema[key].format(row[key], row) : row[key]
          }
        </td>
      ))
    }
  </tr>;
};

const List = ({ schema }) => {
  const rows = useSelector(state => state.model);

  return <table className="govuk-table">
    <thead>
      <tr>
        {
          Object.keys(schema).map(key => <th key={key}><Snippet>{`fields.${key}.label`}</Snippet></th>)
        }
      </tr>
    </thead>
    <tbody>
      {
        rows.length ? rows.map(row => <Row schema={schema} row={row} key={row.id} />) : <td colSpan={Object.keys(schema).length}>No returns downloaded yet</td>
      }
    </tbody>
  </table>;
};

export default List;
