const { connect } = require('react-redux');
const ExportLink = require('../components/export-link');

const mapStateToProps = state => ({
  filter: state.list.filter
});

module.exports = connect(
  mapStateToProps
)(ExportLink);
