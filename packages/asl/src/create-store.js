const { createStore } = require('redux');
const rootReducer = require('./reducers');

module.exports = (...args) => createStore(rootReducer, ...args);
