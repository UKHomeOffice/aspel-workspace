const { connect } = require('react-redux');

const Filters = require('../components/filters');
const { uniqueByType } = require('../../src/reducers/places');
const {
  toggleFilter,
  clearFilters
} = require('../../src/actions/filters');

const mapStateToProps = (state, { page }) => ({
  filterBy: state.filters.filterBy,
  uniqueByType: uniqueByType(state.places.all, page)
});

const mapDispatchToProps = dispatch => ({
  toggleFilter: (key, value) => dispatch(toggleFilter(key, value)),
  clearFilters: () => dispatch(clearFilters())
});

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
