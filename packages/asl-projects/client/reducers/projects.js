import * as types from '../actions/types';

export default function projectsReducer(state = [], action) {
  switch (action.type) {
    case types.LOAD_PROJECTS:
      // Ensure we always return an array even if action.projects is undefined
      return Array.isArray(action.projects) ? action.projects : [];

    case types.CREATE_PROJECT:
      // Verify the project has an id before adding
      return action.project?.id ? [...state, action.project] : state;

    case types.UPDATE_PROJECT:
      // More robust update check
      if (!action.project?.id) return state;
      return state.map(project =>
        project.id === action.project.id ? { ...project, ...action.project } : project
      );

    case types.DELETE_PROJECT:
      // Ensure we have an id to filter by
      return action.id ? state.filter(project => project.id !== action.id) : state;

    default:
      return state;
  }
}
