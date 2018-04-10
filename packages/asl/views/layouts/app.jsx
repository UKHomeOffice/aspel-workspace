const React = require('react');
const { Provider } = require('react-redux');
const Layout = require('./default');

const App = props => {
  return <Provider store={ props.store }>
    <React.Fragment>
      <script dangerouslySetInnerHTML={{__html: `window.INITIAL_STATE=${JSON.stringify(props.store.getState())}`}} />
      <Layout { ...props }>{ props.children }</Layout>
    </React.Fragment>
  </Provider>;
};

module.exports = App;
