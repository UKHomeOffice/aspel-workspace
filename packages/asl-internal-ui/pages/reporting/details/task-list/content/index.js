const { merge } = require('lodash');
const tasklistContent = require('@asl/pages/pages/task/list/content');

module.exports = merge({}, tasklistContent, {
  fields: {
    updatedAt: {
      label: 'Completed'
    }
  },
  backToMetrics: 'Back to all performance metrics',
  title: {
    'project-application': 'New project applications granted',
    'all-project-application': 'Project applications granted',
    'legacy-project-application': 'Legacy project applications granted',

    'project-amendment': 'New project amendments granted',
    'all-project-amendment': 'Project amendments granted',
    'legacy-project-amendment': 'Legacy project amendments granted',

    'project-revoke': 'New project revocations granted',
    'all-project-revoke': 'Project revocations granted',
    'legacy-project-revoke': 'Legacy project revocations granted',

    'project-transfer': 'New project transfers granted',
    'all-project-transfer': 'Project transfers granted',
    'legacy-project-transfer': 'Legacy project transfers granted',

    'project-grant-ra': 'Retrospective assessments completed',

    'pil-application': 'PIL applications granted',
    'pil-amendment': 'PIL amendments granted',
    'pil-revoke': 'PIL revocations granted',
    'pil-transfer': 'PIL transfers granted',
    'pil-review': 'PIL reviews granted',

    'establishment-grant': 'Establishment applications granted',
    'establishment-update': 'Establishment amendments granted',
    'establishment-revoke': 'Establishment revocations granted',

    'role-create': 'Named people assignments granted',
    'role-delete': 'Named people removals granted',

    'place-update': 'Approved area amendments granted',
    'place-create': 'Approved area additions granted',
    'place-delete': 'Approved area deletions granted'
  }
});
