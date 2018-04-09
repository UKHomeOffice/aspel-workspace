const { connect } = require('react-redux');
const Search = require('../pages/search');
const { setTextFilter } = require('../../src/actions/filters');

const mapStateToProps = state => ({
  establishment: state.establishment
});

module.exports = connect(
  mapStateToProps,
  { setTextFilter }
)(Search);
