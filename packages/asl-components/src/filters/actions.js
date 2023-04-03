const { queryStringFromState } = require('../utils');
const { fetchItems } = require('../actions');
const merge = require('lodash/merge');
const get = require('lodash/get');
const set = require('lodash/set');

const setFilters = filters => ({
    type: 'SET_FILTERS',
    filters
});

const changeFilters = filters => (dispatch, getState) => {
    const state = merge({}, getState());
    const searchFilter = get(state, 'datatable.filters.active[*]');

    if (searchFilter) {
        filters['*'] = searchFilter;
    }

    set(state, 'datatable.filters.active', filters);

    const query = queryStringFromState(state);

    return fetchItems(`${state.static.url}?${query}`, dispatch)
        .then(() => dispatch(setFilters(filters)));
};

module.exports = {
    changeFilters
};
