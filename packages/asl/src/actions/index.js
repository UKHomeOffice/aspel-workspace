const {
  SET_TEXT_FILTER,
  SET_LIST_ITEMS,
  SET_ESTABLISHMENT,
  SET_PROFILE,
  SET_SCHEMA
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

const setProfile = profile => ({
  type: SET_PROFILE,
  profile
});

const setSchema = schema => ({
  type: SET_SCHEMA,
  schema
});

module.exports = {
  setTextFilter,
  setListItems,
  setEstablishment,
  setProfile,
  setSchema
};
