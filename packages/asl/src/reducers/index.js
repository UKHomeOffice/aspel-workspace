const { combineReducers } = require('redux');
const { filterBy, textFilter } = require('./filters');
const establishment = require('./establishment');
const places = require('./places');
const list = require('./list');

module.exports = combineReducers({
  filters: combineReducers({ filterBy, textFilter }),
  establishment,
  places,
  list
});
