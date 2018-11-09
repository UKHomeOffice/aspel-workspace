import { queryStringFromState } from '../utils';
import { fetchItems } from '../actions';
import merge from 'lodash/merge';

export const setFilter = (key, value) => ({
  type: 'SET_FILTER',
  key,
  value
});

export const clickLinkFilter = (column, filter) => (dispatch, getState) => {
  const state = getState();
  const query = queryStringFromState(merge({}, state, {
    datatable: { filters: { active: { [column]: [filter] } } }
  }));
  return fetchItems(`${state.static.url}?${query}`, dispatch)
    .then(() => dispatch(setFilter(column, filter)));
};
