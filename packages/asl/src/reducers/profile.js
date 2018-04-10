const {
  SET_PROFILE
} = require('../constants/action-types');

const establishment = (state = {}, action) => {
  switch (action.type) {
    case SET_PROFILE:
      return { ...action.profile };
  }
  return state;
};

module.exports = establishment;
