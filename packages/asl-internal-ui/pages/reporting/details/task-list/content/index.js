const { merge } = require('lodash');
const tasklistContent = require('@asl/pages/pages/task/list/content');

module.exports = merge({}, tasklistContent, {
  fields: {
    updatedAt: {
      label: 'Completed'
    }
  },
  buttons: {
    submit: 'Update'
  },
  backToMetrics: 'Back to all completed tasks',
  subtitle: {
    'project-application': 'New PPLs',
    'legacy-project-application': 'Legacy PPLs',

    'project-amendment': 'New PPLs',
    'legacy-project-amendment': 'Legacy PPLs',

    'project-revoke': 'New PPLs',
    'legacy-project-revoke': 'Legacy PPLs',

    'project-transfer': 'New PPLs',
    'legacy-project-transfer': 'Legacy PPLs',

    'project-change-licence-holder': 'New PPLs',
    'legacy-project-change-licence-holder': 'Legacy PPLs'
  },
  title: {
    'project-application': 'Project licences granted',
    'all-project-application': 'Project licences granted',
    'legacy-project-application': 'Project licences granted',

    'project-amendment': 'Project licences amended',
    'all-project-amendment': 'Project licences amended',
    'legacy-project-amendment': 'Project licences amended',

    'project-revoke': 'Project licences revoked',
    'all-project-revoke': 'Project licences revoked',
    'legacy-project-revoke': 'Project licences revoked',

    'project-transfer': 'Project licences transferred',
    'all-project-transfer': 'Project licences transferred',
    'legacy-project-transfer': 'Project licences transferred',

    'project-change-licence-holder': 'Project licence holder changes granted',
    'all-project-change-licence-holder': 'Project licence holder changes granted',
    'legacy-project-change-licence-holder': 'Project licence holder changes granted',

    'project-grant-ra': 'Retrospective assessments completed',

    'pil-application': 'Personal licences granted',
    'pil-amendment': 'Personal licences amended',
    'pil-revoke': 'Personal licences revoked',
    'pil-transfer': 'Personal licences transferred',
    'pil-review': 'Personal licence reviews granted',

    'establishment-application': 'Establishment applications granted',
    'establishment-update': 'Establishment amendments granted',
    'establishment-revoke': 'Establishment revocations granted',

    'role-create': 'Named people assignments granted',
    'role-delete': 'Named people removals granted',

    'place-update': 'Approved area amendments granted',
    'place-create': 'Approved area additions granted',
    'place-delete': 'Approved area deletions granted',

    'rop-submit': 'ROP submissions (includes any resubmissions)'
  }
});
