import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { doSort } from './actions';
import { ApplyChanges, Snippet } from '../';

const getLabel = id => <span data-testid={`header-${id}`}><Snippet>{`fields.${id}.label`}</Snippet></span>;

export const TableHeader = ({
    id,
    column,
    ascending,
    onHeaderClick,
    sortable,
    disabled,
    label,
    headerProps
}) => {
    const isSortable = sortable !== false && column !== undefined && ascending !== undefined;
    return (
        <th
            aria-sort={ isSortable ? (column === id ? (ascending ? 'ascending' : 'descending') : 'none') : undefined }
            {...(headerProps ?? {})}
        >
            {
                isSortable
                    ? <ApplyChanges
                        query={{
                            sort: {
                                column: id,
                                ascending: column === id ? !ascending : true
                            }
                        }}
                        className={classnames({ disabled })}
                        onApply={() => onHeaderClick(id)}
                        label={label || getLabel(id)}
                    />
                    : label || getLabel(id)
            }
        </th>
    );
};

const mapStateToProps = ({
    datatable: {
        sort: { column, ascending },
        data: { isFetching }
    }
}, {
    sortable
}) => ({
    disabled: isFetching,
    column,
    ascending,
    sortable
});

const mapDispatchToProps = dispatch => ({
    onHeaderClick: id => dispatch(doSort(id))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TableHeader);
