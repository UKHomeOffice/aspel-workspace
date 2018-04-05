const { connect } = require('react-redux');

const { uniq, flatten } = require('lodash');

const Filters = require('../components/filters');
const {
  toggleFilter,
  clearFilters
} = require('../../src/actions/filters');

const uniqueByType = (filter, rows) => {
  return {
    title: filter.title,
    label: filter.label,
    key: filter.key,
    values: uniq(flatten(rows.map(r => r[filter.key])))
  };
};

const mapStateToProps = (state, { filters }) => ({
  filterBy: state.filters.filterBy,
  filters: filters.map(filter => uniqueByType(filter, state.places))
});

module.exports = connect(
  mapStateToProps,
  { toggleFilter, clearFilters }
)(Filters);
