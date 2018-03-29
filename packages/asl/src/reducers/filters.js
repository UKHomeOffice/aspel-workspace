const { combineReducers } = require('redux');
const { reduce } = require('lodash');
const {
  TOGGLE_COLLAPSED,
  TOGGLE_FILTER,
  CLEAR_FILTERS,
  SET_TEXT_FILTER
} = require('../constants/action-types');
const filterHelpers = require('../helpers/filters');

const collapsedInitialState = reduce(filterHelpers, (state, value, key) => ({ ...state, [key]: true }), {});

const collapsed = (state = collapsedInitialState, action) => {
  switch (action.type) {
    case TOGGLE_COLLAPSED:
      return { ...state, [action.id]: !state[action.id] };
    default:
      return state;
  }
};

const filterByInitialState = reduce(filterHelpers, (state, value, key) => ({ ...state, [key]: [] }), {});

const filterBy = (state = filterByInitialState, action) => {
  switch (action.type) {
    case TOGGLE_FILTER:
      const res = state[action.key].slice();
      const i = res.indexOf(action.value);
      if (i === -1) {
        res.push(action.value);
      } else {
        res.splice(i, 1);
      }
      return {
        ...state,
        [action.key]: res
      };
    case CLEAR_FILTERS:
      return filterByInitialState;
    default:
      return state;
  }
};

const textFilter = (state = '', action) => {
  switch (action.type) {
    case SET_TEXT_FILTER:
      return action.text;
    case CLEAR_FILTERS:
      return '';
    default:
      return state;
  }
};

module.exports = combineReducers({
  collapsed,
  filterBy,
  textFilter
});
