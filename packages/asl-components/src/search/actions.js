const merge = require('lodash/merge');
const { queryStringFromState } = require('../utils');
const { fetchItems } = require('../actions');
const { setFilter } = require('../link-filter/actions');

const doSearch = search => (dispatch, getState) => {
  const state = getState();
  const query = queryStringFromState(merge({}, state, {
    datatable: { filters: { active: { '*': search } } }
  }));
  return fetchItems(`${state.static.url}?${query}`, dispatch)
    .then(() => dispatch(setFilter('*', search)));
};

module.exports = {
  doSearch
};
