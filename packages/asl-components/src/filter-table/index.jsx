import React, { Fragment } from 'react';
import { Datatable, Filters, FilterSummary, Link, Snippet } from '../';

const FilterTable = ({
  formatters,
  expands,
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
    <Datatable formatters={ formatters } expands={expands} />
  </Fragment>
);

export default FilterTable;
