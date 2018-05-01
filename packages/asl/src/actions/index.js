const {
  SET_LIST_ITEMS,
  SET_ESTABLISHMENT,
  SET_PROFILE,
  SET_SCHEMA
} = require('../constants/action-types');

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
  setListItems,
  setEstablishment,
  setProfile,
  setSchema
};
