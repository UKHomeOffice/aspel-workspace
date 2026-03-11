import start from '@asl/projects';
import cloneDeep from 'lodash/cloneDeep';

const state = window.INITIAL_STATE;

function getVersionedData(field) {
  return {
    first: state.static[field]?.first ?? [],
    latest: state.static[field]?.latest ?? [],
    granted: state.static[field]?.granted ?? []
  };
}

start({
  project: {
    ...state.model.data,
    id: state.model.id
  },
  savedProject: cloneDeep({
    ...state.model.data,
    id: state.model.id
  }),
  comments: state.static.comments,
  ...((state.static.isGranted || state.static.legacyGranted)
    ? { changes: {}, added: {}, removed: {} }
    : {
      changes: getVersionedData('changes'),
      added: getVersionedData('added'),
      removed: getVersionedData('removed')
    }
  ),
  application: {
    readonly: true,
    commentable: state.static.commentable,
    showComments: state.static.showComments,
    user: `${state.static.user.firstName} ${state.static.user.lastName}`,
    basename: state.static.basename,
    schemaVersion: state.model.project.schemaVersion,
    project: state.static.project,
    projectUrl: state.static.projectUrl,
    establishment: state.static.establishment,
    showConditions: state.static.showConditions,
    editConditions: state.static.editConditions,
    isGranted: state.static.isGranted,
    isPreview: state.static.isPreview,
    isDraft: state.static.isDraft,
    asruUser: state.static.asruUser,
    previewLink: state.static.previewLink,
    legacyGranted: state.static.legacyGranted,
    previousProtocols: state.static.previousProtocols,
    previousAA: state.static.previousAA,
    establishments: state.static.establishments || [],
    raCompulsory: state.model.raCompulsory,
    licenceHolder: state.model.licenceHolder,
    isActionable: state.static.isActionable,
    taskLink: state.static.taskLink
  },
  static: {
    imageRoot: '/attachment',
    ...state.static
  }
});
