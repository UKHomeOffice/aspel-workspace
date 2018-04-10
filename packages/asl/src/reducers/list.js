const { some } = require('lodash');

const {
  SET_TEXT_FILTER,
  SET_LIST_ITEMS
} = require('../constants/action-types');

const INITIAL_STATE = {
  filter: '',
  all: [],
  filtered: []
};

const applyFilter = (list, text) => {
  if (!text) {
    return list.map(f => f);
  }
  return list.filter(row => some(Object.values(row), value => {
    if (Array.isArray(value)) {
      return some(value, v => v.toLowerCase() === text.toLowerCase());
    }
    if (typeof value === 'string') {
      return value.toLowerCase().includes(text.toLowerCase());
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
  }

  const filtered = applyFilter(newState.all, newState.filter);
  return { ...newState, filtered };
};

module.exports = reducer;
