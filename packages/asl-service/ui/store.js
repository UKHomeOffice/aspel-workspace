const { configureStore } = require('@reduxjs/toolkit');
const url = require('url');
const rootReducer = require('./reducers');
const { queryStringFromState } = require('@ukhomeoffice/asl-components/src/utils');

function persistStateMiddleware(storeAPI) {
  return next => action => {
    const result = next(action);

    if (typeof window !== 'undefined') {
      switch (action.type) {
        case 'SET_SORT':
        case 'SET_FILTERS':
        case 'SET_FILTER':
        case 'SET_PAGE': {
          const href = new url.URL(window.location.href);
          href.search = queryStringFromState(storeAPI.getState());
          window.history.replaceState(undefined, undefined, href.toString());
        }
      }
    }

    return result;
  };
}

module.exports = function configureAppStore(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(persistStateMiddleware),
    preloadedState,
    devTools: process.env.NODE_ENV === 'development'
  });
};
