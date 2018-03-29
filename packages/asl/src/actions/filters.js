const {
  TOGGLE_FILTER,
  CLEAR_FILTERS,
  SET_TEXT_FILTER
} = require('../constants/action-types');

const toggleFilter = (key, value) => ({
  type: TOGGLE_FILTER,
  key,
  value
});

const clearFilters = () => ({
  type: CLEAR_FILTERS
});

const setTextFilter = text => ({
  type: SET_TEXT_FILTER,
  text
});

module.exports = {
  toggleFilter,
  clearFilters,
  setTextFilter
};
