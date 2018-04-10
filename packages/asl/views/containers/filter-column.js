const { connect } = require('react-redux');
const FilterColumn = require('../components/filter-column');
const { toggleFilter } = require('../../src/actions/filters');

const mapStateToProps = (state, { filter: { key } }) => ({
  filterBy: state.filters.filterBy[key]
});

module.exports = connect(
  mapStateToProps,
  { toggleFilter }
)(FilterColumn);
