const updateIssueDate = require('./update-issue-date');

module.exports = {
  updateIssueDate: {
    path: '/update-issue-date',
    permissions: 'project.updateIssueDate',
    router: updateIssueDate
  }
};
