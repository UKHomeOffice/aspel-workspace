const updateIssueDate = require('./update-issue-date');

module.exports = {
  updateIssueDate: {
    path: '/:projectId/update-issue-date',
    permissions: 'project.updateIssueDate',
    router: updateIssueDate
  }
};
