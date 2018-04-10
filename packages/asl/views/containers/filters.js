const { connect } = require('react-redux');
const { uniq, flatten } = require('lodash');
const Filters = require('../components/filters');

const uniqueByType = (filter, rows) => ({
  title: filter.title,
  label: filter.label,
  key: filter.key,
  values: uniq(flatten(rows.map(r => r[filter.key])))
});

const mapStateToProps = (state, { filters }) => ({
  filters: filters.map(filter => uniqueByType(filter, state.places))
});

module.exports = connect(
  mapStateToProps
)(Filters);
