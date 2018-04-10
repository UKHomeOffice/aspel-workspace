const { connect } = require('react-redux');
const FilterColumn = require('../components/filter-column');
const { toggleFilter } = require('../../src/actions/filters');

const mapStateToProps = (state, { id }) => ({
  filterBy: state.filters.filterBy[id]
});

module.exports = connect(
  mapStateToProps,
  { toggleFilter }
)(FilterColumn);
