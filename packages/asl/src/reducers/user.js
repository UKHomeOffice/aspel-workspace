const { SET_USER } = require('../constants/action-types');

const INITIAL_STATE = '';

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER:
      return action.name;
  }
  return state;
};

module.exports = userReducer;
