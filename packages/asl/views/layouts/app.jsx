const React = require('react');
const { Provider } = require('react-redux');
const Layout = require('./default');

const App = ({
  store,
  children,
  scripts,
  crumbs
}) => (
  <Provider store={ store }>
    <React.Fragment>
      <script dangerouslySetInnerHTML={{__html: `window.INITIAL_STATE=${JSON.stringify(store.getState())}`}} />
      <Layout
        scripts={scripts}
        crumbs={crumbs}
      >{ children }</Layout>
    </React.Fragment>
  </Provider>
);

module.exports = App;
