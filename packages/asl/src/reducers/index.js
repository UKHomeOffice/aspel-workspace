const { combineReducers } = require('redux');
const filters = require('./filters');
const establishment = require('./establishment');
const places = require('./places');

module.exports = combineReducers({
  filters,
  establishment,
  places,
  pdf: state => state || false
});
