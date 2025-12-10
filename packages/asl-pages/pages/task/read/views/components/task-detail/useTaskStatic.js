import { useSelector } from 'react-redux';
import get from 'lodash/get';

export default function useTaskStatic(task = {}) {
  const staticState = useSelector(state => state.static || {});
  const { project: staticProject, version: staticVersion, establishment: staticEstablishment, profile: staticProfile, values: staticValues, isAsru, year } = staticState;

  const model = get(task, 'data.model');
  const taskEstablishment = get(task, 'data.establishment');
  const establishment = staticEstablishment || taskEstablishment;
  const project = staticProject || staticValues.project;
  const version = staticVersion;
  const profileFromTask = staticProfile || get(task, 'data.modelData.profile') || staticValues;
  const modelData = get(task, 'data.modelData');
  const trainingTask = get(task, 'data.data');
  const trainingCourse = get(task, 'data.modelData.trainingCourse');

  const isApplication = task.type === 'application';
  const isAmendment = task.type === 'amendment';
  const profileType = isApplication ? 'applicant' : isAmendment ? 'amendment' : 'licenceHolder';

  return {
    staticState,
    isAsru,
    year,
    model,
    establishment,
    project,
    version,
    profile: profileFromTask,
    modelData,
    trainingTask,
    trainingCourse,
    isApplication,
    isAmendment,
    profileType
  };
}
