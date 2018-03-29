const { connect } = require('react-redux');

const Filters = require('../components/filters');
const { uniqueByType } = require('../../src/reducers/places');
const {
  toggleCollapsed,
  toggleFilter,
  clearFilters
} = require('../../src/actions/filters');

const mapStateToProps = (state, { page }) => ({
  collapsed: state.filters.collapsed,
  filterBy: state.filters.filterBy,
  uniqueByType: uniqueByType(state.places.all, page)
});

const mapDispatchToProps = dispatch => ({
  clickMore: id => dispatch(toggleCollapsed(id)),
  toggleFilter: (key, value) => dispatch(toggleFilter(key, value)),
  clearFilters: () => dispatch(clearFilters())
});

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
