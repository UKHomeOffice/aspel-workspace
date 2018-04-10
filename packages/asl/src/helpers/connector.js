const { connect } = require('react-redux');
const { pick } = require('lodash');

module.exports = (Component, ...keys) => {
  keys.push('establishment');
  return connect(state => pick(state, keys))(Component);
};
