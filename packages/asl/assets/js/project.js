import start from '@asl/projects';
import { throwError } from '@asl/projects/client/actions/messages';
import debounce from 'lodash/debounce';
import fetch from 'r2';

const updateProject = project => {
  return {
    type: 'UPDATE_PROJECT',
    project
  };
};

const state = window.INITIAL_STATE;

const postData = debounce((data, dispatch) => {
  fetch(state.static.basename, {
    method: 'PUT',
    credentials: 'include',
    json: data
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
        });
    })
    .catch(err => {
      dispatch(throwError(err.message));
    });
}, 500, { maxWait: 5000 });

const onUpdate = props => {
  return (dispatch, getState) => {
    const project = getState().project;
    const data = { ...project, ...props };
    dispatch(updateProject(data));
    return postData(data, dispatch);
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
