import './polyfills';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import Alert from './components/alert';
import ErrorBoundary from './components/error-boundary';
import ProjectRouter from './project-router';
import configureStore from './store';

const renderApp = initialState => {
  const store = configureStore(initialState);
  const container = document.getElementById('ppl-drafting-tool');
  const root = createRoot(container);

  root.render(
    <ErrorBoundary
      message="Sorry, there is a problem with this page"
      section={true}
    >
      <Provider store={store}>
        <React.Fragment>
          <Alert />
          <ProjectRouter />
        </React.Fragment>
      </Provider>
    </ErrorBoundary>
  );
};

export default renderApp;
