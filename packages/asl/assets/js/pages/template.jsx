import React from 'react';
import url from 'url';
import { stringify } from 'qs';
import { render } from 'react-dom';
import { applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import Component from '../../../views/{{page}}';
import createStore from '../../../src/create-store';

const persistState = store => next => action => {
  const result = next(action);
  switch (action.type) {
    case 'SET_SORT':
    case 'SET_TEXT_FILTER':
      const { list: { filter }, sort } = store.getState();
      const href = url.parse(window.location.href);
      href.search = stringify({ filter, sort });
      window.history.replaceState(undefined, undefined, href.format());
  }
  return result;
};

const store = createStore(window.INITIAL_STATE, applyMiddleware(persistState));

render(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.getElementById('page-component')
);
