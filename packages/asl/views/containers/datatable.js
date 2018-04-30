import { connect } from 'react-redux';
import DataTable, { setSort } from '@ukhomeoffice/asl-components/components/datatable';
import { applyFilter } from '@ukhomeoffice/asl-components/components/text-filter';

const mapStateToProps = state => ({
  data: applyFilter(state),
  schema: state.list.schema,
  sort: state.sort
});

const mapDispatchToProps = dispatch => ({
  onChange: sort => dispatch(setSort(sort))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataTable);
