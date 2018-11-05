import * as types from './types';
import database from '../database';

import { showMessage } from './messages';

export function loadProjects() {
  return (dispatch, getState) => {
    return database()
      .then(db => db.list())
      .then(projects => dispatch({ type: types.LOAD_PROJECTS, projects }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function createProject(project) {
  return (dispatch, getState) => {
    return database()
      .then(db => db.create(project))
      .then(project => dispatch({ type: types.CREATE_PROJECT, project }))
      .then(() => dispatch(showMessage('Project created!')))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function deleteProject(id) {
  return (dispatch, getState) => {
    return database()
      .then(db => db.delete(id))
      .then(() => dispatch({ type: types.DELETE_PROJECT, id }))
      .then(() => dispatch(showMessage('Project deleted!')))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function updateProject(id, data) {
  return (dispatch, getState) => {
    const project = getState().projects.find(p => p.id === id);
    if (!project) {
      return dispatch({ type: types.ERROR, error: new Error(`Unknown project: ${id}`) });
    }
    return database()
      .then(db =>  db.update(id, { ...project, ...data }))
      .then(project => dispatch({ type: types.UPDATE_PROJECT, id, project }))
      .then(() => dispatch(showMessage('Project saved!')))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}
