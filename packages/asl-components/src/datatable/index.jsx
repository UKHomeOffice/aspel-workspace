import React, { Fragment, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import classnames from 'classnames';
import map from 'lodash/map';
import merge from 'lodash/merge';
import size from 'lodash/size';
import pickBy from 'lodash/pickBy';
import { getValue } from '../utils';
import DatatableHeader from './header';
import { Pagination } from '../';

function Row({ row, schema, Expandable, Actions, expands }) {
  const [expanded, setExpanded] = useState(false);
  const expandable = Expandable && expands(row);

  function toggleExpanded() {
    if (!expandable) {
      return;
    }
    setExpanded(!expanded);
  }

  return (
    <Fragment>
      <tr
        onClick={toggleExpanded}
        className={classnames({ expandable, expanded })}
      >
        {
          map(schema, (column, key) => {
            const datum = getValue({ row, schema: column, key });
            return <td key={key} className={key}>
              { column.format ? column.format(datum, row) : datum }
            </td>;
          })
        }
        {
          Actions && <td><Actions model={row} /></td>
        }
      </tr>
      {
        expanded && (
          <tr className='expanded-content' onClick={toggleExpanded}>
            <td colSpan={size(schema)}>
              <Expandable model={row} />
            </td>
          </tr>
        )
      }
    </Fragment>
  );
}

function selector(state) {
  const { datatable: { data: { rows, isFetching }, sort, schema } } = state;
  return {
    sort,
    data: rows,
    isFetching,
    schema
  };
}

export default function Datatable({
  expands = () => true,
  Expandable,
  className,
  Actions,
  actionsHeader = 'Actions',
  formatters
}) {
  const {
    data = [],
    schema: tableSchema,
    sortable,
    isFetching
  } = useSelector(selector, shallowEqual);

  const schema = pickBy(merge({}, tableSchema, formatters), (item, key) => item.show);

  return (
    <table className={classnames('govuk-table', 'govuk-react-datatable', className, isFetching && 'loading')}>
      <thead>
        <tr>
          {
            map(schema, (column, key) =>
              <DatatableHeader key={key} id={key} sortable={sortable} { ...column } />
            )
          }
          {
            Actions && <th>{actionsHeader}</th>
          }
        </tr>
        <tr id="filter-header"></tr>
      </thead>
      <tbody>
        {
          data.map(row => <Row key={row.id} schema={schema} row={row} Expandable={Expandable} Actions={Actions} expands={expands} />)
        }
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={size(schema) + (Actions ? 1 : 0)}>
            <Pagination />
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
