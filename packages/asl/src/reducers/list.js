const { some } = require('lodash');

const {
  SET_TEXT_FILTER
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

const list = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_TEXT_FILTER:
      const filtered = applyFilter(state.all, action.text);
      return { ...state, filter: action.text, filtered };
  }

  const filtered = applyFilter(state.all, state.filter);
  return { ...state, filtered };
};

module.exports = list;
