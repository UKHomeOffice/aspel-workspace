import start from '@asl/projects';
import { throwError } from '@asl/projects/client/actions/messages';
import { updateSavedProject } from '@asl/projects/client/actions/projects';
import debounce from 'lodash/debounce';
import fetch from 'r2';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
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
          const { savedProject } = getState();
          const patched = applyPatches(savedProject, patch)
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
  savedProject: cloneDeep({
    ...state.model.data,
    id: state.model.id
  }),
  comments: state.static.comments,
  changes: {
    latest: (state.static.changes && state.static.changes.latest) || [],
    granted: (state.static.changes && state.static.changes.granted) || []
  },
  application: {
    commentable: state.static.commentable,
    establishment: state.static.establishment,
    showComments: state.static.showComments,
    readonly: state.model.status !== 'draft' || !state.static.canUpdate,
    user: `${state.static.user.firstName} ${state.static.user.lastName}`,
    basename: state.static.basename,
    schemaVersion: state.model.project.schemaVersion,
    newApplication: state.static.newApplication
  }
});
