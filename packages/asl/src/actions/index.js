const {
  SET_TEXT_FILTER,
  SET_LIST_ITEMS,
  SET_ESTABLISHMENT
} = require('../constants/action-types');

const setTextFilter = text => ({
  type: SET_TEXT_FILTER,
  text
});

const setListItems = items => ({
  type: SET_LIST_ITEMS,
  items
});

const setEstablishment = establishment => ({
  type: SET_ESTABLISHMENT,
  establishment
});

module.exports = {
  setTextFilter,
  setListItems,
  setEstablishment
};
