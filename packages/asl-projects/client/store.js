import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducers';
import { thunk } from 'redux-thunk';

const createAppStore = (initialState = {}) => configureStore({
  reducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default createAppStore;
