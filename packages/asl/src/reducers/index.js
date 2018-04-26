const { combineReducers } = require('redux');
const establishment = require('./establishment');
const list = require('./list');
const profile = require('./profile');
const { sort } = require('asl-components/components/datatable');

module.exports = combineReducers({
  establishment,
  list,
  profile,
  sort
});
