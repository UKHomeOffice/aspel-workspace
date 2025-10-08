const closedStatuses = ['resolved', 'rejected', 'discarded-by-asru', 'discarded-by-applicant', 'withdrawn-by-applicant'];

module.exports = task => ({
  ...task,
  open: task && task.status ? !closedStatuses.includes(task.status) : false
});
