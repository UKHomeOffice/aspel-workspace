import React from 'react';
import url from 'url';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { pick } from 'lodash';
import { format, parse } from '../../../src/helpers/query-string';
import Component from '../../../views/{{page}}';
import createStore from '../../../src/create-store';

const initialFilters = parse(window.location.href);

const store = createStore(window.INITIAL_STATE, pick(initialFilters, ['filterBy', 'textFilter']));

store.subscribe(() => {
  const filters = { filter: store.getState().list.filter };
  const href = url.parse(window.location.href);
  href.search = format(filters);
  window.history.replaceState(undefined, undefined, href.format());
});

render(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.getElementById('page-component')
);
