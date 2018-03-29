const { createStore } = require('redux');
const rootReducer = require('./reducers');

module.exports = data => createStore(rootReducer, { ...data, places: { all: data.places } });
