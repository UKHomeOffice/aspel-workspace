import { queryStringFromState, getSort } from '../utils';
import { fetchItems } from '../actions';
import merge from 'lodash/merge';

const setSort = sort => ({
  type: 'SET_SORT',
  sort
});

export const doSort = column => (dispatch, getState) => {
  const state = getState();
  const sort = getSort(column, state.datatable.sort);
  const query = queryStringFromState(merge({}, state, {
    datatable: { sort }
  }));
  return fetchItems(`${state.static.url}?${query}`, dispatch)
    .then(() => dispatch(setSort(sort)));
};
