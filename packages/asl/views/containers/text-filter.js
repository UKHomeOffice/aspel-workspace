import { connect } from 'react-redux';
import TextFilter, { setTextFilter } from '@ukhomeoffice/asl-components/components/text-filter';

const mapStateToProps = state => ({
  filter: state.filter
});

const mapDispatchToProps = dispatch => ({
  onChange: filter => dispatch(setTextFilter(filter))
});

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(TextFilter);
