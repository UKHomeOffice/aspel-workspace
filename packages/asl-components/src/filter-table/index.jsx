import React, { Fragment } from 'react';
import { DataTable, Filters, FilterSummary, Link, Snippet } from '../';

const FilterTable = ({
  formatters,
  ExpandableRow,
  createPath
}) => (
  <Fragment>
    <Filters formatters={ formatters }/>
    <div className="table-heading">
      <FilterSummary />
      {
        createPath && <Link label={<Snippet>addNew</Snippet>} page={createPath} />
      }
    </div>
    <DataTable formatters={ formatters } ExpandableRow={ExpandableRow} />
  </Fragment>
);

export default FilterTable;
