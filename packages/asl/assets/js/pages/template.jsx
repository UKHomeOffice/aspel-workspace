const React = require('react');
const { render } = require('react-dom');
const { Provider } = require('react-redux');
const Component = require('../../../views/containers/{{page}}');
const createStore = require('../../../src/create-store');

const store = createStore(window.INITIAL_STATE);

render(
  <Provider store={store}>
    <Component />
  </Provider>
  , document.getElementById('page-component')
);
