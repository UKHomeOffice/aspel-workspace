const { get } = require('lodash');

module.exports = task => {
  const model = get(task, 'data.model');
  const action = get(task, 'data.action');
  const isApplication = get(task, 'data.modelData.status') !== 'active';

  switch (model) {
    case 'establishment':
      return 'PEL - Establishment';

    case 'place':
      return 'PEL - Area';

    case 'role':
      return 'PEL - Named Person';

    case 'trainingPil':
    case 'pil':
      const label = model === 'trainingPil' ? 'Cat E PIL' : 'PIL';

      if (action === 'revoke') {
        return `${label} Revocation`;
      }
      if (action === 'grant') {
        return `${label} - ${isApplication ? 'Application' : 'Amendment'}`;
      }
      break;

    case 'project':
      if (action === 'grant-ra') {
        return 'Retrospective assessment';
      }

      if (isApplication) {
        if (task.data.modelData?.isContinuation) {
          return 'PPL - Project continuation';
        }

        if (task.data.modelData?.deadline) {
          return 'PPL - Statutory deadline';
        }

        return 'PPL - Application';
      }

      switch (action) {
        case 'transfer':
          return 'PPL - Establishment transfer';

        case 'revoke':
          return 'PPL - Revocation';

        case 'change-licence-holder':
          return 'PPL - Change licence holder';

        default:
          return 'PPL - Amendment';
      }

    case 'profile':
      return 'Profile';

    default:
      return 'other';
  }
};
