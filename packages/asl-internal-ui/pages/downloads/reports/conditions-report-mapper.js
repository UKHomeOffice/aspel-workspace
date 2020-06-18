const { get, omit } = require('lodash');

const CONDITIONS = require('@asl/projects/client/constants/conditions').default;
const RA = require('@asl/projects/client/constants/retrospective-assessment').default;

const defaults = {
  level: '',
  protocol_name: '',
  type: '',
  condition: 'none',
  requires_editing: '',
  edited: '',
  content: ''
};

const getCondition = condition => {

  if (!condition.key) {
    return {
      ...condition,
      ...defaults
    };
  }

  const defaultCondition = get(CONDITIONS[condition.level], condition.path) || {};
  const isCustom = condition.custom || condition.key === 'custom';
  const isRA = condition.key === 'retrospective-assessment';

  const requiresEditing = isCustom || isRA ? false : (defaultCondition.requiresEditing || false);

  return {
    ...omit(condition, 'key', 'path', 'autoAdded'),
    condition: isRA ? 'Retrospective Assessment' : (isCustom ? 'CUSTOM' : defaultCondition.title),
    requires_editing: requiresEditing ? 'true' : 'false',
    content: isRA ? RA.required : (condition.content || condition.edited || defaultCondition.content)
  };
};

module.exports = getCondition;
