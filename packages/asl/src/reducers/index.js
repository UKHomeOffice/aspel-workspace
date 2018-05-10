const { combineReducers } = require('redux');
const establishment = require('./establishment');
const list = require('./list');
const profile = require('./profile');
const user = require('./user');
const { sort } = require('@ukhomeoffice/asl-components/components/datatable');
const { filter } = require('@ukhomeoffice/asl-components/components/text-filter');

module.exports = combineReducers({
  establishment,
  list,
  profile,
  user,
  sort,
  filter
});
