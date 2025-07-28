import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const defaultReducer = (state = {}) => state;

export function buildMockStore(state, reducers = { default: defaultReducer }) {
  return configureStore({
    reducer: reducers,
    preloadedState: { default: state }
  });
}

export function MockReduxProvider({ state, reducers, children }) {
  const store = buildMockStore(state, reducers);
  return <Provider store={store}>{children}</Provider>;
}
