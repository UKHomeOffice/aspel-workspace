import React, { Fragment } from 'react';
import DataTable from '../containers/datatable';
import TextFilter from '../containers/text-filter';
import ExportLink from '../containers/export-link';

export default ({
  formatters
}) => (
  <Fragment>
    <TextFilter />
    <DataTable formatters={ formatters } />
    <ExportLink />
  </Fragment>
);
