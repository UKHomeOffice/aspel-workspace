import React from 'react';
import url from 'url';
import { stringify } from 'qs';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Component from '../../../views/{{page}}';
import createStore from '../../../src/create-store';

const store = createStore(window.INITIAL_STATE);

store.subscribe(() => {
  const { filter, sort } = store.getState().list;
  const href = url.parse(window.location.href);
  href.search = stringify({ filter, sort });
  window.history.replaceState(undefined, undefined, href.format());
});

render(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.getElementById('page-component')
);
