import React, { Fragment } from 'react';
import { Datatable, Filters, FilterSummary, Link, Snippet } from '../';

const FilterTable = ({
  formatters,
  createPath,
  otherLinks,
  ...props
}) => (
  <Fragment>
    <Filters formatters={formatters} />
    <div className="table-heading">
      <FilterSummary {...props} />
      <div className="actions">
        {
          otherLinks && otherLinks.map(link => link)
        }
        {
          createPath && <Link label={<Snippet>addNew</Snippet>} page={createPath} />
        }
      </div>
    </div>
    <Datatable formatters={formatters} {...props} />
  </Fragment>
);

export default FilterTable;
