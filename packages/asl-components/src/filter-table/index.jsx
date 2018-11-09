import React, { Fragment } from 'react';
import { Datatable, Filters, FilterSummary, Link, Snippet } from '../';

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
    <Datatable formatters={ formatters } ExpandableRow={ExpandableRow} />
  </Fragment>
);

export default FilterTable;
