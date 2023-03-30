const { queryStringFromState, getSort } = require('../utils');
const { fetchItems } = require('../actions');
const merge = require('lodash/merge');

const setSort = sort => ({
    type: 'SET_SORT',
    sort
});

const doSort = column => (dispatch, getState) => {
    const state = getState();
    const sort = getSort(column, state.datatable.sort);
    const query = queryStringFromState(merge({}, state, {
        datatable: { sort }
    }));
    return fetchItems(`${state.static.url}?${query}`, dispatch)
        .then(() => dispatch(setSort(sort)));
};

module.exports = {
    doSort
};
