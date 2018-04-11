const React = require('react');
const { map } = require('lodash');

const ListTable = ({
  data,
  schema
}) => (
  <table>
    <thead>
      <tr>
        {
          map(schema, ({ title }, key) => <th key={key}>{title ? title(key) : key}</th>)
        }
      </tr>
    </thead>
    <tbody>
      {
        data.map(row => (
          <tr key={row.id}>
            {
              map(schema, ({ format }, key) => <td key={key}>{ format ? format(row[key]) : row[key] }</td>)
            }
          </tr>
        ))
      }
    </tbody>
  </table>
);

module.exports = ListTable;
