const { get } = require('lodash');

const determineTaskType = task => {
  const action = get(task, 'data.action');
  const modelStatus = get(task, 'data.modelData.status', 'inactive');

  switch (action) {
    case 'grant-ra':
      return 'ra';
    case 'transfer':
      return 'transfer';
    case 'review':
      return 'review';
    case 'revoke':
      return 'revocation';
    case 'grant':
      return modelStatus !== 'active' ? 'application' : 'amendment';
    default:
      return 'amendment';
  }
};

module.exports = task => ({
  ...task,
  type: determineTaskType(task)
});
