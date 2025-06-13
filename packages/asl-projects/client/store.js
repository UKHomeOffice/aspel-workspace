import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducers';

const createAppStore = (initialState = {}) => configureStore({
  reducer,
  preloadedState: initialState,
  // middleware: getDefaultMiddleware() // no need to add thunk explicitly, it's included by default
});

export default createAppStore;
