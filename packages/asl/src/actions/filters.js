const {
  TOGGLE_FILTER,
  TOGGLE_COLLAPSED,
  CLEAR_FILTERS,
  SET_TEXT_FILTER
} = require('../constants/action-types');

const toggleFilter = (key, value) => ({
  type: TOGGLE_FILTER,
  key,
  value
});

const toggleCollapsed = id => ({
  type: TOGGLE_COLLAPSED,
  id
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
  toggleCollapsed,
  clearFilters,
  setTextFilter
};
