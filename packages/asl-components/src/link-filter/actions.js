const { queryStringFromState } = require('../utils');
const { fetchItems } = require('../actions');
const merge = require('lodash/merge');

const setFilter = (key, value) => ({
    type: 'SET_FILTER',
    key,
    value
});

const clickLinkFilter = (column, filter) => (dispatch, getState) => {
    const state = getState();
    const query = queryStringFromState(merge({}, state, {
        datatable: { filters: { active: { [column]: [filter] } } }
    }));
    return fetchItems(`${state.static.url}?${query}`, dispatch)
        .then(() => dispatch(setFilter(column, filter)));
};

module.exports = {
    setFilter,
    clickLinkFilter
};
