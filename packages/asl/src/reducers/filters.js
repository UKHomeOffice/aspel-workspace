const { combineReducers } = require('redux');
const {
  TOGGLE_FILTER,
  CLEAR_FILTERS,
  SET_TEXT_FILTER
} = require('../constants/action-types');

const filterSettings = require('../helpers/filters');

const generateInitialState = () => filterSettings.reduce((state, filter) => ({ ...state, [filter.key]: [] }), {});

const filterBy = (state = Object.assign({}, generateInitialState()), action) => {
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
      return Object.assign({}, generateInitialState());
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
  filterBy,
  textFilter
});
