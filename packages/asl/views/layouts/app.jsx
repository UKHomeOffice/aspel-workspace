const React = require('react');
const { pick } = require('lodash');
const { Provider } = require('react-redux');
const Layout = require('./default');

const createStore = require('../../src/create-store');

const App = props => {
  const {
    pdf,
    children,
    exposes,
    filterBy,
    textFilter
  } = props;
  const data = pick(props, exposes);
  const store = createStore(data, { filterBy, textFilter, pdf });
  return (
    <Provider store={ store }>
      <Layout { ...props } data={ data }>{ children }</Layout>
    </Provider>
  );
};

module.exports = App;
