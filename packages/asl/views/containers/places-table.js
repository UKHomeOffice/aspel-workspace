const { connect } = require('react-redux');
const { filterData, searchData } = require('../../src/reducers/places');
const PlacesTable = require('../components/places-table');

const mapStateToProps = state => ({
  rows: filterData(searchData(state.places, state.filters.textFilter), state.filters.filterBy)
});

module.exports = connect(
  mapStateToProps
)(PlacesTable);
