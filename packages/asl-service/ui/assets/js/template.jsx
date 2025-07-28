import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

// eslint-disable-next-line implicit-dependencies/no-implicit
import Component from '{{page}}';
// eslint-disable-next-line implicit-dependencies/no-implicit
import configureAppStore from '@asl/service/ui/store';
// eslint-disable-next-line implicit-dependencies/no-implicit

const store = configureAppStore(window.INITIAL_STATE || {});

hydrateRoot(
  document.getElementById('page-component'),
  <Provider store={store}>
    <Component />
  </Provider>
);
