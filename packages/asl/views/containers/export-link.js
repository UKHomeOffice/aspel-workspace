const { connect } = require('react-redux');
const ExportLink = require('../components/export-link');

const mapStateToProps = ({ filters, sort }) => ({
  filters,
  sort
});

module.exports = connect(
  mapStateToProps
)(ExportLink);
