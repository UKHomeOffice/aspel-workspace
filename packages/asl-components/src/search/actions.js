import { queryStringFromState } from '../utils';
import { fetchItems } from '../actions';
import { setFilter } from '../link-filter/actions';

export const doSearch = search => (dispatch, getState) => {
  const state = getState();
  const query = queryStringFromState(merge({}, state, {
    datatable: { filters: { active: { '*': search } } }
  }));
  return fetchItems(`${state.static.url}?${query}`, dispatch)
    .then(() => dispatch(setFilter('*', search)));
};
