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
    commentable: state.static.commentable,
    establishment: state.static.establishment,
    showComments: state.static.showComments,
    readonly: state.static.readonly,
    user: `${state.static.user.firstName} ${state.static.user.lastName}`,
    basename: state.static.basename,
    projectUrl: state.static.projectUrl,
    project: state.static.project,
    grantedVersion: state.static.grantedVersion,
    newApplication: state.static.newApplication,
    sidebarLinks: state.static.sidebarLinks,
    canSubmit: state.static.canSubmit,
    schemaVersion: 'RA',
    licenceHolder: state.static.project.licenceHolder
  },
  static: cloneDeep(state.static)
});
