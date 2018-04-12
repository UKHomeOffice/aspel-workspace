const React = require('react');
const { map, merge, pickBy, get } = require('lodash');

const ListTable = ({
  data,
  schema,
  formatters
}) => {
  const columns = merge({}, pickBy(schema, v => v.show), formatters);
  return (
    <table>
      <thead>
        <tr>
          {
            map(columns, ({ title }, key) => <th key={key}>{title ? title(key) : key}</th>)
          }
        </tr>
      </thead>
      <tbody>
        {
          data.map(row => (
            <tr key={row.id}>
              {
                map(columns, ({ format, accessor }, key) => {
                  const datum = accessor ? get(row, accessor) : row[key];
                  return <td key={key}>{ format ? format(datum, row[key]) : datum }</td>;
                })
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  );
};

module.exports = ListTable;
