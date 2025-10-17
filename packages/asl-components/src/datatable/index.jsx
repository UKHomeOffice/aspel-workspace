import React, { Fragment, useState, useEffect, useRef } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import classnames from 'classnames';
import map from 'lodash/map';
import merge from 'lodash/merge';
import size from 'lodash/size';
import pickBy from 'lodash/pickBy';
import { getValue } from '../utils';
import DatatableHeader from './header';
import { Pagination } from '../';
import Snippet from '../snippet';

export function Row({ row, schema, Expandable, Actions, expands, alwaysExpanded }) {
    const rowExpands = expands(row);
    const [expanded, setExpanded] = useState(rowExpands && alwaysExpanded);
    const expandable = Expandable && rowExpands && !alwaysExpanded;

    useEffect(() => {
        setExpanded(expanded || (rowExpands && alwaysExpanded));
    }, [rowExpands, alwaysExpanded]);

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
                        return <td key={key} className={classnames(key, column.className)}>
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

export function Datatable({
    CustomRow,
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
    noDataWarning,
    allowScroll = true,
    caption,
    tableProps
}) {
    const schema = pickBy(merge({}, tableSchema, formatters), (item) => item.show);
    const RowComponent = CustomRow || Row;
    const colSpan = size(schema) + (Actions ? 1 : 0);
    const tableRef = useRef(null);
    const [scrollActive, setScrollActive] = useState(false);

    useEffect(() => {
        if (!allowScroll) {
            return;
        }
        if (!isFetching) {
            if (!scrollActive) {
                setScrollActive(true); // prevents immediate scroll to table on initial page load
                return;
            }
            tableRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isFetching]);

    return (
        <table
            className={classnames('govuk-table', 'govuk-react-datatable', className, isFetching && 'loading')}
            ref={tableRef}
            {...(tableProps ?? {})}
        >
            {caption &&
              <caption className='govuk-table__caption govuk-table__caption--m'>
                  <Snippet>{caption}</Snippet>
              </caption>
            }
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
                    data.length === 0 && noDataWarning && <tr><td colSpan={colSpan}>{noDataWarning}</td></tr>
                }
                {
                    data.map((row, index) => {
                        const key = row.id ?? `row-${index}`;
                        return (
                            <RowComponent
                                key={key}
                                schema={schema}
                                row={row}
                                Expandable={Expandable}
                                Actions={Actions}
                                expands={expands}
                                alwaysExpanded={alwaysExpanded}
                            />
                        );
                    })
                }
            </tbody>
            {
                !(pagination?.hideUI || (pagination?.autoUI && pagination?.totalPages <= 1)) &&
          <tfoot>
              <tr>
                  <td colSpan={colSpan}>
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
    globalProps.pagination = {
        ...(props.pagination ?? {}),
        ...(globalProps.pagination ?? {}),
    };

    return (
        <Datatable {...props} {...globalProps} />
    );
}
