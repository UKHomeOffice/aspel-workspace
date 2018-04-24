import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import DataTable, { setSort } from 'govuk-react-components/components/datatable';
import TextFilter from '../containers/text-filter';
import ExportLink from '../containers/export-link';

const mapStateToProps = state => ({
  data: state.list.filtered,
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
  schema,
  formatters
}) => (
  <Fragment>
    <TextFilter />
    <ConnectedDataTable
      schema={ schema }
      formatters={ formatters }
    />
    <ExportLink />
  </Fragment>
);
