const updateIssueDate = require('./update-issue-date');
const updateLicenceNumber = require('./update-licence-number');

module.exports = {
  updateIssueDate: {
    path: '/update-issue-date',
    permissions: 'project.updateIssueDate',
    router: updateIssueDate
  },
  updateLicenceNumber: {
    path: '/update-licence-number',
    permissions: 'project.updateLicenceNumber',
    router: updateLicenceNumber
  }
};
