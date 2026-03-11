import * as types from '../actions/types';

const INITIAL_STATE = {
  latest: [],
  granted: [],
  first: []
};

const added = (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case types.SET_ADDED: {
      const { latest, granted, first } = action;

      return { latest, granted, first };
    }
  }

  return state;
};

export default added;
