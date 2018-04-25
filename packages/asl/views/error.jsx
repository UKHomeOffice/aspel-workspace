import React from 'react';
import App from './layouts/app';

const Index = ({
  store,
  error: {
    message,
    stack
  }
}) => (
  <App
    store={store}
    crumbs={['Error']}
  >
    <header>
      <h2>&nbsp;</h2>
      <h1>{ message }</h1>
    </header>
    <pre>
      { stack }
    </pre>
  </App>
);

export default Index;
