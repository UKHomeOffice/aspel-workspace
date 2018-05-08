import React, { Fragment } from 'react';
import DataTable from '../containers/datatable';
import Filters from '../containers/filters';
import ExportLink from '../containers/export-link';

const FilterTable = ({
  formatters
}) => (
  <Fragment>
    <Filters formatters={ formatters }/>
    <DataTable formatters={ formatters } />
    <ExportLink />
  </Fragment>
);

export default FilterTable;
