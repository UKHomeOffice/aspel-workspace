const React = require('react');
const url = require('url');
const { render } = require('react-dom');
const { Provider } = require('react-redux');
const { pick } = require('lodash');
const { format, parse } = require('../../../src/helpers/query-string');
const Component = require('../../../views/containers/{{page}}');
const createStore = require('../../../src/create-store');

const initialFilters = parse(window.location.href);

const store = createStore(window.INITIAL_STATE, pick(initialFilters, ['filterBy', 'textFilter']));

store.subscribe(() => {
  const filters = store.getState().filters;
  const href = url.parse(window.location.href);
  href.search = format(filters);
  window.history.replaceState(undefined, undefined, href.format());
});

render(
  <Provider store={store}>
    <Component />
  </Provider>
  , document.getElementById('page-component')
);
