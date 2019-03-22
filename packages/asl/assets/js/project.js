import start from '@asl/projects';
import debounce from 'lodash/debounce';
import fetch from 'r2';

const updateProject = project => {
  return {
    type: 'UPDATE_PROJECT',
    project
  };
};

const state = window.INITIAL_STATE;

const postData = debounce(data => {
  fetch(state.static.basename, {
    method: 'PUT',
    credentials: 'include',
    json: data
  })
    .response
    .then(response => {
      // notifiy saved
    })
    .catch(err => {
      console.error(err);
    });
}, 500, { maxWait: 5000 });

const onUpdate = props => {
  return (dispatch, getState) => {
    const project = getState().project;
    const data = { ...project, ...props };
    dispatch(updateProject(data));
    return postData(data);
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
    readonly: state.model.status !== 'draft',
    schemaVersion: state.model.project.schemaVersion 
  }
});
