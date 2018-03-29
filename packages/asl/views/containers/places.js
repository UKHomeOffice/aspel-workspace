const { connect } = require('react-redux');
const { filterData } = require('../../src/reducers/places');
const Places = require('../pages/places');

const mapStateToProps = state => ({
  establishment: state.establishment,
  places: filterData(state.places.all, state.filters.filterBy),
  applyButton: false
});

module.exports = connect(
  mapStateToProps
)(Places);
