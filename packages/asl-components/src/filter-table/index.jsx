import React, { Fragment } from 'react';
import { Datatable, Filters, FilterSummary, Link, Snippet } from '../';

const FilterTable = ({
  formatters,
  createPath,
  downloadLink,
  ...props
}) => (
  <Fragment>
    <Filters formatters={formatters} />
    <div className="table-heading">
      <FilterSummary {...props} />
      <div className="actions">
        { downloadLink && downloadLink }
        { createPath && <Link label={<Snippet>addNew</Snippet>} page={createPath} /> }
      </div>
    </div>
    <Datatable formatters={formatters} {...props} />
  </Fragment>
);

export default FilterTable;
