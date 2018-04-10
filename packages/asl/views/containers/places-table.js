const { connect } = require('react-redux');
const { filterData, searchData } = require('../../src/reducers/places');
const PlacesTable = require('../components/places-table');

const mapStateToProps = state => ({
  rows: state.list.filtered
});

module.exports = connect(
  mapStateToProps
)(PlacesTable);
