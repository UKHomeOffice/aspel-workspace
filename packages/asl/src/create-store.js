const { merge } = require('lodash');
const { createStore } = require('redux');
const rootReducer = require('./reducers');
const filtersReducer = require('./reducers/filters');

module.exports = (data, { filterBy, textFilter }) => {
  const filters = merge(filtersReducer(undefined, {}), { filterBy, textFilter });
  return createStore(rootReducer, { ...data, places: { all: data.places }, filters });
};
