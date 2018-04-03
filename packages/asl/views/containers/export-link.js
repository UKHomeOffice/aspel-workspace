const { connect } = require('react-redux');
const ExportLink = require('../components/export-link');

const mapStateToProps = state => ({
  filterBy: state.filters.filterBy,
  filterText: state.filters.filterText
});

module.exports = connect(
  mapStateToProps
)(ExportLink);
