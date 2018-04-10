const {
  SET_ESTABLISHMENT
} = require('../constants/action-types');

const establishment = (state = {}, action) => {
  switch (action.type) {
    case SET_ESTABLISHMENT:
      let licenceHolder;
      if (Array.isArray(action.establishment.roles)) {
        licenceHolder = action.establishment.roles.find(r => r.type === 'elh');
      }
      return { ...action.establishment, licenceHolder };
  }
  return state;
};

module.exports = establishment;
