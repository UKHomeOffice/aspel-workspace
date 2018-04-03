/* eslint implicit-dependencies/no-implicit: [2, { dev: true }] */

const React = require('react');
const { render } = require('react-dom');
const { Provider } = require('react-redux');
const { pick } = require('lodash');
const qs = require('qs');
const url = require('url');
const Component = require('../../../views/containers/{{page}}');
const createStore = require('../../../src/create-store');

const initialFilters = qs.parse(url.parse(window.location.href).query);

const store = createStore(window.INITIAL_STATE, pick(initialFilters, ['filterBy', 'textFilter']));

store.subscribe(() => {
  const filters = store.getState().filters;
  if (!filters.textFilter) {
    delete filters.textFilter;
  }
  const location = url.parse(window.location.href);
  location.search = qs.stringify(filters);
  window.history.replaceState(undefined, undefined, location.format());
});

render(
  <Provider store={store}>
    <Component />
  </Provider>
  , document.getElementById('page-component')
);
