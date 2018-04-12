const { some, pickBy, get, map } = require('lodash');

const {
  SET_TEXT_FILTER,
  SET_LIST_ITEMS,
  SET_SCHEMA
} = require('../constants/action-types');

const INITIAL_STATE = {
  filter: '',
  all: [],
  filtered: [],
  schema: []
};

const flattenNestedCols = (row, schema, csv) =>
  map(csv ? schema : pickBy(schema, s => s.show), (value, key) =>
    value.accessor ? get(row, value.accessor) : row[key]
  );

const applyFilter = ({ all, filter, schema }) => {
  if (!filter) {
    return all.map(f => f);
  }
  return all.filter(row => some(flattenNestedCols(row, schema), value => {
    try {
      if (Array.isArray(value)) {
        return some(value, v => v.toLowerCase() === filter.toLowerCase());
      }
      if (typeof value === 'string') {
        return value.toLowerCase().includes(filter.toLowerCase());
      }
    } catch (e) {
      return false;
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
    case SET_SCHEMA:
      newState.schema = action.schema;
  }

  const filtered = applyFilter(newState);
  return { ...newState, filtered };
};

reducer.flattenNestedCols = flattenNestedCols;

module.exports = reducer;
