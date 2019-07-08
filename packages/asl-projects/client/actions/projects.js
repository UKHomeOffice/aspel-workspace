import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';

import * as types from './types';
import database from '../database';
import { throwError } from './messages';
import { showMessage } from './messages';
import sendMessage from './messaging';

export function loadProjects() {
  return dispatch => {
    return database()
      .then(db => db.list())
      .then(projects => dispatch({ type: types.LOAD_PROJECTS, projects }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function loadProject(id) {
  return dispatch => {
    return database()
      .then(db => db.read(id))
      .then(project => dispatch({ type: types.LOAD_PROJECT, project }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function setProject(project) {
  return {
    type: types.SET_PROJECT,
    project
  }
}

export function createProject(project) {
  return dispatch => {
    return database()
      .then(db => db.create(project))
      .then(project => {
        dispatch({ type: types.CREATE_PROJECT, project });
        dispatch(showMessage('Project created!'));
        return project;
      })
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function importProject(project) {
  project = omit(project, 'id');
  return dispatch => {
    return database()
      .then(db => db.create(project))
      .then(project => dispatch({ type: types.CREATE_PROJECT, project }))
      .then(() => dispatch(showMessage('Project imported!')))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function deleteProject(id) {
  return dispatch => {
    return database()
      .then(db => db.delete(id))
      .then(() => dispatch({ type: types.DELETE_PROJECT, id }))
      .then(() => dispatch(showMessage('Project deleted!')))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function updateProject(project) {
  return {
    type: types.UPDATE_PROJECT,
    project
  }
}

export function addChange(change) {
  return {
    type: types.ADD_CHANGE,
    change
  }
}

export function updateSavedProject(project) {
  return {
    type: types.UPDATE_SAVED_PROJECT,
    project
  }
}

const debouncedUpdate = debounce((id, data, dispatch) => {
  return database()
    .then(db => db.update(id, data))
    .then(() => updateSavedProject(data))
    // TODO: notify user autosaved.
    .catch(err => dispatch({ type: types.ERROR, err }))
}, 500, { maxWait: 5000 })

export function updateAndSave(data) {
  return (dispatch, getState) => {
    const project = getState().project;
    const newState = { ...project, ...data };
    dispatch(updateProject(newState));
    const id = project.id;
    return debouncedUpdate(id, newState, dispatch);
  };
}

const doConditionsUpdate = (data, dispatch, state) => {
  const { application: { basename } } = state;
  const params = {
    method: 'PUT',
    url: `${basename.replace(/\/edit?/, '')}/conditions`,
    data
  };
  return Promise.resolve()
    .then(() => sendMessage(params))
    .catch(err => {
      console.error(err);
      dispatch(throwError('Error updating conditions'));
    });
}

export function updateRetrospectiveAssessment(retrospectiveAssessment) {
  return (dispatch, getState) => {
    const state = getState();
    const newState = {
      ...state.project,
      retrospectiveAssessment
    };
    dispatch(updateProject(newState));
    return doConditionsUpdate({ retrospectiveAssessment }, dispatch, state)
      .then(() => {
        dispatch(updateSavedProject(newState));
        dispatch(showMessage('Retrospective assessment details saved'))
      })
  }
}

export function updateConditions(type, conditions, protocolId) {
  return (dispatch, getState) => {
    const state = getState();
    const newConditions = !protocolId
      ? [
        ...(state.project.conditions || []).filter(condition => condition.type !== type),
        ...conditions
      ]
      : [
        ...((state.project.protocols || [])
          .find((p => p.id === protocolId) || {}).conditions || []).filter(condition => condition.type !== type),
        ...conditions
      ]
    const data = type === 'legacy'
      ? { conditions }
      : { conditions: newConditions, protocolId }

    const newState = cloneDeep(state.project);
    if (protocolId) {
      newState.protocols = newState.protocols.map(protocol => {
        if (protocol.id === protocolId) {
          return { ...protocol, conditions: newConditions }
        }
        return protocol;
      })
    } else {
      newState.conditions = type === 'legacy' ? conditions : newConditions;
    }
    dispatch(updateProject(newState));
    return doConditionsUpdate(data, dispatch, state)
      .then(() => {
        dispatch(updateSavedProject(newState));
        dispatch(showMessage(`${type === 'condition' ? 'Conditions': 'Authorisations'} synced`))
      })
  }
}

export function fetchQuestionVersions(key) {

  return (dispatch, getState) => {
    const { application: { basename } } = getState();

    const params = {
      url: `${basename}/question/${key}`
    }

    return Promise.resolve()
      .then(() => sendMessage(params))
      .then(versions => dispatch({ type: types.LOAD_QUESTION_VERSIONS, versions, key }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  }
}
