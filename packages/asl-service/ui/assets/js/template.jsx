import React, { Suspense } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Wrapper } from '@ukhomeoffice/asl-components';

import Component from '{{page}}';
import configureAppStore from '@asl/service/ui/store';

const store = configureAppStore(window.INITIAL_STATE || {});

hydrateRoot(
  document.getElementById('page-component'),
  <Provider store={store}>
    <Wrapper>
      <Suspense fallback={<div className="loading">Loading…</div>}>
        <Component />
      </Suspense>
    </Wrapper>
  </Provider>
);
