const { connect } = require('react-redux');
const ListTable = require('../components/list-table');
const { setSortColumn } = require('../../src/actions');

const mapStateToProps = ({ list: { sort: { column, ascending } } }) => ({
  column,
  ascending
});

module.exports = connect(
  mapStateToProps,
  { setSortColumn }
)(ListTable);
