const { connect } = require('react-redux');
const ExportLink = require('../components/export-link');

const mapStateToProps = ({ filter, sort }) => ({
  filter,
  sort
});

module.exports = connect(
  mapStateToProps
)(ExportLink);
