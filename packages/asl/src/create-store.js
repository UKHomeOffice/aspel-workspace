const { createStore } = require('redux');
const initialState = require('./helpers/initial-state');
const rootReducer = require('./reducers');

module.exports = (data, persistedState) =>
  createStore(rootReducer, initialState(data, persistedState));
