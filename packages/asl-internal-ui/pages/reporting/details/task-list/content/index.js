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

    'pil-application': 'PIL applications granted',
    'pil-amendment': 'PIL amendments granted'
  }
});
