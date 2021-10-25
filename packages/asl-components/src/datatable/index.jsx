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

export function Row({ row, schema, Expandable, Actions, expands, alwaysExpanded }) {
  const [expanded, setExpanded] = useState(false);
  const rowExpands = expands(row);
  const expandable = Expandable && rowExpands && !alwaysExpanded;

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
        className={classnames({ expandable, expanded: expanded || (rowExpands && alwaysExpanded) })}
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
        rowExpands && (expanded || alwaysExpanded) && (
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

export function Datatable({
  expands = () => true,
  Expandable,
  alwaysExpanded = false,
  className,
  Actions,
  actionsHeader = 'Actions',
  formatters,
  sortable,
  data = [],
  isFetching,
  schema: tableSchema,
  pagination,
  noDataWarning
}) {
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
          data.length === 0 && noDataWarning
            ? <tr><td colSpan={size(schema) + (Actions ? 1 : 0)}>{noDataWarning}</td></tr>
            : data.map(row => <Row key={row.id} schema={schema} row={row} Expandable={Expandable} Actions={Actions} expands={expands} alwaysExpanded={alwaysExpanded} />)
        }
      </tbody>
      {
        !pagination.hideUI &&
          <tfoot>
            <tr>
              <td colSpan={size(schema) + (Actions ? 1 : 0)}>
                <Pagination />
              </td>
            </tr>
          </tfoot>
      }
    </table>
  );
}

function selector(state) {
  const { datatable: { data: { rows, isFetching }, schema, pagination } } = state;
  return {
    data: rows,
    isFetching,
    schema,
    pagination
  };
}

export default function ConnectedDatatable(props) {

  const globalProps = useSelector(selector, shallowEqual);

  return (
    <Datatable {...props} {...globalProps} />
  );
}
