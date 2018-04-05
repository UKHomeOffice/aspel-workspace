const { connect } = require('react-redux');
const Search = require('../pages/search');
const { setTextFilter } = require('../../src/actions/filters');
const { filterData, searchData } = require('../../src/reducers/places');

const mapStateToProps = state => ({
  establishment: state.establishment,
  places: filterData(searchData(state.places, state.filters.textFilter), state.filters.filterBy),
  textFilter: state.filters.textFilter
});

module.exports = connect(
  mapStateToProps,
  { setTextFilter }
)(Search);
