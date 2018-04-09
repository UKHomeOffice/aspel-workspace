const { connect } = require('react-redux');
const { setTextFilter } = require('../../src/actions/filters');
const TextFilter = require('../components/text-filter');

const mapStateToProps = state => ({
  textFilter: state.filters.textFilter
});

module.exports = connect(
  mapStateToProps,
  { setTextFilter }
)(TextFilter);
