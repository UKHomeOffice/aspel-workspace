import { combineReducers } from 'redux';

import projects from './projects';
import project from './project';
import savedProject from './saved-project';
import application from './application';
import message from './message';
import settings from './settings';

const rootReducer = combineReducers({
  projects,
  project,
  savedProject,
  application,
  message,
  settings
});

export default rootReducer;
