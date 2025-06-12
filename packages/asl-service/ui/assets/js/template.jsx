import React, { Suspense, lazy } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Wrapper } from '@ukhomeoffice/asl-components';
import configureAppStore from '../../store';

const pageName = window.PAGE_NAME; // set this in your template or script
const Component = lazy(() => import(`../pages/${pageName}`));

const store = configureAppStore(window.INITIAL_STATE || {});

hydrateRoot(
  document.getElementById('page-component'),
  <Provider store={store}>
    <Wrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    </Wrapper>
  </Provider>
);
