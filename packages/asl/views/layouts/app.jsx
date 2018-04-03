const React = require('react');
const { pick } = require('lodash');
const { Provider } = require('react-redux');
const Layout = require('./default');
const Pdf = require('./pdf');

const createStore = require('../../src/create-store');

const App = props => {
  const {
    pdf,
    children,
    exposes
  } = props;
  const data = pick(props, exposes);
  const store = createStore(data);
  return (
    <Provider store={ store }>
      { pdf
        ? <Pdf>{ children }</Pdf>
        : <Layout { ...props } data={ data }>{ children }</Layout>
      }
    </Provider>
  );
};

module.exports = App;
