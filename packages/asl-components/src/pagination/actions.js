import { queryStringFromState } from '../utils';
import { fetchItems } from '../actions';
import merge from 'lodash/merge';

export const changePage = page => (dispatch, getState) => {
  const state = getState();
  const query = queryStringFromState(merge({}, state, {
    datatable: { pagination: { page } }
  }));
  return fetchItems(`${state.static.url}?${query}`, dispatch)
    .then(() => dispatch(setPage(page)));
};
