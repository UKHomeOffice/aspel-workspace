const { queryStringFromState } = require('../utils');
const { fetchItems } = require('../actions');
const merge = require('lodash/merge');

const setPage = page => ({
  type: 'SET_PAGE',
  page
});

const changePage = page => (dispatch, getState) => {
  const state = getState();
  const query = queryStringFromState(merge({}, state, {
    datatable: { pagination: { page } }
  }));
  return fetchItems(`${state.static.url}?${query}`, dispatch)
    .then(() => dispatch(setPage(page)));
};

module.exports = {
  changePage
};
