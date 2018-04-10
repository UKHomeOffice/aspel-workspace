const { connect } = require('react-redux');
const { setTextFilter } = require('../../src/actions');
const TextFilter = require('../components/text-filter');

const mapStateToProps = state => ({
  textFilter: state.list.filter
});

module.exports = connect(
  mapStateToProps,
  { setTextFilter }
)(TextFilter);
