import React, { Fragment } from 'react';
import { Datatable, Filters, FilterSummary } from '../';

const FilterTable = ({
    formatters,
    actions,
    ...props
}) => (
    <Fragment>
        <Filters formatters={formatters} />
        <div className="table-heading">
            <FilterSummary {...props} />
            <div className="actions">{ actions }</div>
        </div>
        <Datatable formatters={formatters} {...props} />
    </Fragment>
);

export default FilterTable;
