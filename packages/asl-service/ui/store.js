const url = require('url');
const { applyMiddleware, createStore } = require('redux');
const thunk = require('redux-thunk').default;
const rootReducer = require('./reducers');
const { queryStringFromState } = require('@ukhomeoffice/asl-components/src/utils');
const { composeWithDevTools } = require('@redux-devtools/extension');

function persistState(store) {
  return next => action => {
    const result = next(action);

    // Only run in browser
    if (typeof window !== 'undefined') {
      switch (action.type) {
        case 'SET_SORT':
        case 'SET_FILTERS':
        case 'SET_FILTER':
        case 'SET_PAGE': {
          const href = new url.URL(window.location.href);
          href.search = queryStringFromState(store.getState());
          window.history.replaceState(undefined, undefined, href.toString());
        }
      }
    }

    return result;
  };
}

const middleware = [thunk, persistState];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middleware.push(logger);
}

const enhancer = process.env.NODE_ENV === 'development'
  ? composeWithDevTools(applyMiddleware(...middleware))
  : applyMiddleware(...middleware);

/**
 * Create a Redux store instance.
 * @param {object} [initialState={}] - Optional initial state (e.g., from window or server props)
 */
module.exports = function configureStore(initialState = {}) {
  return createStore(rootReducer, initialState, enhancer);
};
