const { combineReducers } = require('redux');
const establishment = require('./establishment');
const list = require('./list');

module.exports = combineReducers({
  establishment,
  list
});
