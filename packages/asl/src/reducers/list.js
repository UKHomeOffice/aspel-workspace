const {
  SET_LIST_ITEMS,
  SET_SCHEMA
} = require('../constants/action-types');

const INITIAL_STATE = {
  data: [],
  schema: {}
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_LIST_ITEMS:
      return {
        ...state,
        data: action.items
      };
    case SET_SCHEMA:
      return {
        ...state,
        schema: action.schema
      };
  }
  return state;
};

module.exports = reducer;
