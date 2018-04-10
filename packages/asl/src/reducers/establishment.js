const {
  SET_ESTABLISHMENT
} = require('../constants/action-types');

const establishment = (state = {}, action) => {
  switch (action.type) {
    case SET_ESTABLISHMENT:
      return { ...action.establishment };
  }
  return state;
};

module.exports = establishment;
