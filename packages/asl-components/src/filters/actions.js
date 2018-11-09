import { queryStringFromState } from '../utils';
import { fetchItems } from '../actions';
import merge from 'lodash/merge';

const setFilters = filters => ({
  type: 'SET_FILTERS',
  filters
});

export const changeFilters = filters => (dispatch, getState) => {
  const state = getState();
  const query = queryStringFromState(merge({}, state, {
    datatable: { filters: { active: filters } }
  }));
  return fetchItems(`${state.static.url}?${query}`, dispatch)
    .then(() => dispatch(setFilters(filters)));
};
