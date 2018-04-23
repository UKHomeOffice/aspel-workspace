const { some, get, sortBy, chain } = require('lodash');

const {
  SET_TEXT_FILTER,
  SET_LIST_ITEMS,
  SET_SCHEMA,
  SET_SORT
} = require('../constants/action-types');

const INITIAL_STATE = {
  filter: '',
  all: [],
  filtered: [],
  schema: [],
  sort: {}
};

const flattenNestedCols = (row, schema) => {
  return chain(schema)
    .pickBy(s => s.show)
    .map((value, key) => get(row, value.accessor || key))
    .value();
};

const applyFilter = ({ all, filter, schema }) => {
  if (!filter) {
    return all.map(f => f);
  }
  return all.filter(row => some(flattenNestedCols(row, schema), value => {
    if (Array.isArray(value)) {
      return some(value, v => v.toLowerCase() === filter.toLowerCase());
    }
    if (typeof value === 'string') {
      return value.toLowerCase().includes(filter.toLowerCase());
    }
    return false;
  }));
};

const reducer = (state = INITIAL_STATE, action) => {
  const newState = { ...state };

  switch (action.type) {
    case SET_LIST_ITEMS:
      newState.all = action.items;
      break;
    case SET_TEXT_FILTER:
      newState.filter = action.text;
      break;
    case SET_SORT:
      newState.sort = action.sort;
      break;
    case SET_SCHEMA:
      newState.schema = action.schema;
      break;
  }

  const filtered = applyFilter(newState);
  return { ...newState, filtered };
};

module.exports = reducer;
