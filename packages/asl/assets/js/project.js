import start from '@asl/peephole';
import debounce from 'lodash/debounce';

const updateProject = project => {
  return {
    type: 'UPDATE_PROJECT',
    project
  };
};

const state = window.INITIAL_STATE;

const postData = debounce(data => {
  window.fetch(state.static.basename, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      console.log('ok', response);
    })
    .catch(err => console.log('err', err));
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
