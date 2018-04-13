const { connect } = require('react-redux');
const ExportLink = require('../components/export-link');

const mapStateToProps = state => ({
  filter: state.list.filter,
  sort: state.list.sort
});

module.exports = connect(
  mapStateToProps
)(ExportLink);
