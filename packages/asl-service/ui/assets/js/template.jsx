import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Wrapper } from '@ukhomeoffice/asl-components';
import Component from '{{page}}';
import store from '@asl/service/ui/store';

hydrateRoot(
  document.getElementById('page-component'),
  <Provider store={store}>
    <Wrapper>
      <Component />
    </Wrapper>
  </Provider>
);
