const { connect } = require('react-redux');
const Places = require('../pages/places');

const mapStateToProps = state => ({
  establishment: state.establishment
});

module.exports = connect(
  mapStateToProps
)(Places);
