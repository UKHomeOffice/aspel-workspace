import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import DataTable, { setSort } from '@ukhomeoffice/asl-components/components/datatable';
import TextFilter from '../containers/text-filter';
import ExportLink from '../containers/export-link';

const mapStateToProps = state => ({
  data: state.list.filtered,
  schema: state.list.schema,
  sort: state.sort
});

const mapDispatchToProps = dispatch => ({
  onChange: sort => dispatch(setSort(sort))
});

const ConnectedDataTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataTable);

export default ({
  formatters
}) => (
  <Fragment>
    <TextFilter />
    <ConnectedDataTable
      formatters={ formatters }
    />
    <ExportLink />
  </Fragment>
);
