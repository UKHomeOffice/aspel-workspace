import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Wrapper } from '@ukhomeoffice/asl-components';

/* eslint-disable implicit-dependencies/no-implicit */
import Component from '{{page}}';
import configureAppStore from '@uiStore';
/* eslint-enable implicit-dependencies/no-implicit */

const store = configureAppStore(window.INITIAL_STATE || {});

hydrateRoot(
  document.getElementById('page-component'),
  <Provider store={store}>
    <Wrapper>
      <Component />
    </Wrapper>
  </Provider>
);
