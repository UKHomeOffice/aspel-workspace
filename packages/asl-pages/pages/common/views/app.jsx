import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import Layout from './layouts/default';

const App = ({
  store,
  children,
  scripts,
  crumbs,
  url,
  reducers
}) => (
  <Provider store={ store }>
    <Fragment>
      <script dangerouslySetInnerHTML={{__html: `window.INITIAL_STATE=${JSON.stringify(store.getState())}; window.REDUCERS = ${JSON.stringify(reducers)}`}} />
      <Layout
        scripts={scripts}
        crumbs={crumbs}>{ children }</Layout>
    </Fragment>
  </Provider>
);

export default App;
