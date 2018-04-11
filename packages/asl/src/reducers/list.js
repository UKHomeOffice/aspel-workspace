const { some, pick, get } = require('lodash');

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

const applyFilter = ({ all, filter, schema }) => {
  if (!filter) {
    return all.map(f => f);
  }
  return all.filter(row => some(pick(row, Object.keys(schema)), (value, key, a) => {
    try {
      if (Array.isArray(value)) {
        return some(value, v => v.toLowerCase() === filter.toLowerCase());
      }
      if (typeof value === 'object') {
        if (schema[key].accessor) {
          return get(value, schema[key].accessor).toLowerCase().includes(filter.toLowerCase());
        }
        return false;
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

module.exports = reducer;
