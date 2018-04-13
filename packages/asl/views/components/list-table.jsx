const React = require('react');
const { map, merge, pickBy, get } = require('lodash');

const TableHeader = ({
  id,
  title,
  sortColumn,
  ascending,
  setSortColumn,
  sortable
}) => {
  const isSortable = sortable !== false && sortColumn !== undefined && ascending !== undefined;
  const header = title ? title(id) : id;
  return (
    <th
      aria-sort={ isSortable ? (sortColumn === id ? (ascending ? 'ascending' : 'descending') : 'none') : undefined }
    >
      {
        isSortable
          ? <a href="#" onClick={(e) => {
            e.preventDefault();
            setSortColumn(id);
          }}>{ header }</a>
          : header
      }
    </th>
  );
};

const ListTable = ({
  data,
  schema,
  formatters,
  column: sortColumn,
  ascending,
  setSortColumn
}) => {
  const columns = merge({}, pickBy(schema, v => v.show), formatters);
  return (
    <table>
      <thead>
        <tr>
          {
            map(columns, ({ title, sortable }, key) =>
              <TableHeader
                key={key}
                id={key}
                title={title}
                sortColumn={sortColumn}
                ascending={ascending}
                setSortColumn={setSortColumn}
                sortable={sortable}
              />
            )
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
