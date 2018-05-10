/* eslint implicit-dependencies/no-implicit: [2, { dev: true }] */

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
    case 'SET_FILTERS':
      const { filters, sort } = store.getState();
      const href = url.parse(window.location.href);
      href.search = stringify({ filters, sort });
      window.history.replaceState(undefined, undefined, href.format());
  }
  return result;
};

const middleware = [persistState];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middleware.push(logger);
}

const store = createStore(window.INITIAL_STATE, applyMiddleware(...middleware));

render(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.getElementById('page-component')
);
