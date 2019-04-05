import start from '@asl/projects';
import { throwError } from '@asl/projects/client/actions/messages';
import { updateSavedProject } from '@asl/projects/client/actions/projects';
import debounce from 'lodash/debounce';
import fetch from 'r2';
import cloneDeep from 'lodash/cloneDeep';
import { diff, applyChange } from 'deep-diff';

const updateProject = project => {
  return {
    type: 'UPDATE_PROJECT',
    project
  };
};

const applyPatches = (source, patches = []) => {
  const patched = cloneDeep(source);
  patches.forEach(p => {
    applyChange(patched, p);
  });
  return patched;
};

const state = window.INITIAL_STATE;

const postData = debounce((patch, getState, dispatch) => {
  fetch(state.static.basename, {
    method: 'PUT',
    credentials: 'include',
    json: patch
  })
    .response
    .then(response => {
      return response.json()
        .then(json => {
          if (response.status > 399) {
            const err = new Error(json.message || `Fetch failed with status code: ${response.status}`);
            err.status = response.status;
            Object.assign(err, json);
            throw err;
          }
        })
        .then(() => {
          const patched = applyPatches(getState().savedProject, patch);
          dispatch(updateSavedProject(patched));
        });
    })
    .catch(err => {
      console.error(err);
      dispatch(throwError('data sync failed, please try again'));
    });
}, 500, { maxWait: 5000 });

const onUpdate = props => {
  return (dispatch, getState) => {
    const { project, savedProject } = getState();
    const newState = { ...project, ...props };
    dispatch(updateProject(newState));
    const patch = diff(savedProject, newState);
    return postData(patch, getState, dispatch);
  };
};

const onComplete = () => {
  window.location.href = `${state.static.basename}/submit`;
};

start({
  basename: state.static.basename,
  onUpdate,
  onComplete
}, {
  project: {
    ...state.model.data,
    id: state.model.id
  },
  settings: {
    establishments: state.static.establishments.map(e => e.name)
  },
  application: {
    readonly: state.model.status !== 'draft' || !state.static.canUpdate,
    schemaVersion: state.model.project.schemaVersion,
    establishment: state.static.establishment.name
  }
});
