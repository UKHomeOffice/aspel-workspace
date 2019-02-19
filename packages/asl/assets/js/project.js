import start from '@asl/peephole';
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
      // notify error
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

start({
  basename: state.static.basename,
  onUpdate
}, {
  project: {
    ...state.model.data,
    id: state.model.id
  },
  settings: {
    establishments: state.static.establishments.map(e => e.name)
  }
});
