const { combineReducers } = require('redux');
const { filterBy, textFilter } = require('./filters');
const establishment = require('./establishment');
const places = require('./places');

module.exports = combineReducers({
  filters: combineReducers({ filterBy, textFilter }),
  establishment,
  places,
  pdf: state => state || false
});
