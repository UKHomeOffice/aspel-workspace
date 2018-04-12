import React, { Fragment } from 'react';
import ListTable from './list-table';
import TextFilter from '../containers/text-filter';
import ExportLink from '../containers/export-link';

export default ({
  schema,
  formatters,
  data
}) => (
  <Fragment>
    <TextFilter />
    <ListTable schema={ schema } formatters={ formatters } data={ data } />
    <ExportLink />
  </Fragment>
);
