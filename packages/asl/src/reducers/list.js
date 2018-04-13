const { some, pickBy, get, map, sortBy } = require('lodash');

const {
  SET_TEXT_FILTER,
  SET_LIST_ITEMS,
  SET_SCHEMA,
  SET_SORT_COLUMN,
  SET_SORT
} = require('../constants/action-types');

const INITIAL_STATE = {
  filter: '',
  all: [],
  filtered: [],
  schema: [],
  sort: {
    column: '',
    ascending: true
  }
};

const flattenNestedCols = (row, schema, { csv } = {}) =>
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

const applySort = ({ filtered, sort: { column, ascending }, schema }) => {
  if (!column) {
    return filtered;
  }
  let arr = sortBy(filtered, item => {
    if (schema[column].accessor) {
      return get(item, schema[column].accessor);
    }
    return item[column];
  });
  return ascending ? arr : arr.reverse();
};

const sort = (state, action) => {
  switch (action.type) {
    case SET_SORT_COLUMN:
      return {
        column: action.column,
        ascending: state.column === action.column ? !state.ascending : true
      };
  }
  return state;
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
      break;
    case SET_SORT_COLUMN:
      newState.sort = sort(state.sort, action);
      break;
    case SET_SORT:
      newState.sort = action.sort
        ? {
          column: action.sort.column,
          ascending: JSON.parse(action.sort.ascending) // server sends "true" and "false"
        }
        : INITIAL_STATE.sort;
  }

  let filtered = applyFilter(newState);
  filtered = applySort({ ...newState, filtered });
  return { ...newState, filtered };
};

reducer.flattenNestedCols = flattenNestedCols;

module.exports = reducer;
