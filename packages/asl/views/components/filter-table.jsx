import React, { Fragment } from 'react';
import SortableTable from '../containers/sortable-table';
import TextFilter from '../containers/text-filter';
import ExportLink from '../containers/export-link';

export default ({
  schema,
  formatters,
  data
}) => (
  <Fragment>
    <TextFilter />
    <SortableTable schema={ schema } formatters={ formatters } data={ data } />
    <ExportLink />
  </Fragment>
);
