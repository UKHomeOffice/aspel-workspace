import * as types from '../actions/types';

const INITIAL_STATE = {
  latest: [],
  granted: []
};

const changedItems = (state = [], action) => {
  const paths = action.split('.').map((_, i, arr) => arr.slice(0, i + 1).join('.'));

  return paths.reduce((arr, path) => {
    if (path.match(/^reduction-quantities-/)) {
      path = 'reduction-quantities';
    }
    return arr.includes(path) ? arr : [ ...arr, path ];
  }, state);
};

const changes = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_CHANGE: {
      const version = (state.version ?? 0) + 1;
      return {
        ...state,
        version,
        latest: changedItems(state.latest, action.change),
        changeVersions: { [action.change]: version }
      };
    }

    case types.SET_CHANGES: {
      const latest = new Set(action.latest.reduce((arr, item) => changedItems(arr, item), []));
      // Keep any changes made since this request was sent to the server
      Object
        .entries(state.changeVersions ?? {})
        .forEach(([key, version]) => {
          if (version > action.version) {
            latest.add(key);
          }
        });

      return {
        ...state,
        granted: action.granted.reduce((arr, item) => changedItems(arr, item), []),
        latest: [...latest],
        first: action.first.reduce((arr, item) => changedItems(arr, item), [])
      };
    }
  }

  return state;
};

export default changes;
