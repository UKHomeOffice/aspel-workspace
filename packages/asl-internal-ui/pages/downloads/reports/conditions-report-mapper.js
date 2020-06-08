const { get, omit, concat, flatten } = require('lodash');

const CONDITIONS = require('@asl/projects/client/constants/conditions').default;
const RA = require('@asl/projects/client/constants/retrospective-assessment').default;

const getCondition = (condition, level = 'project', protocolTitle = '') => {
  const defaultCondition = get(CONDITIONS[level], condition.path) || {};
  const isCustom = condition.custom || condition.key === 'custom';
  const isRA = condition.key === 'retrospective-assessment';

  return {
    level,
    protocol_name: protocolTitle,
    type: condition.type,
    condition: isRA ? 'Retrospective Assessment' : (isCustom ? 'CUSTOM' : defaultCondition.title),
    requires_editing: isCustom || isRA ? false : (defaultCondition.requiresEditing || false),
    was_edited: !!condition.edited || false,
    content: isRA ? RA.required : (condition.content || condition.edited || defaultCondition.content)
  };
};

const getAllConditions = project => {
  const projectConditions = (project.conditions || []).map(c => getCondition(c, 'project'));

  const protocolConditions = (project.protocols || []).map(p => {
    return (p.conditions || []).map(c => getCondition(c, 'protocol', p.title));
  });

  return concat(projectConditions, flatten(protocolConditions));
};

const missingCondition = {
  level: '',
  protocol_name: '',
  type: '',
  condition: '-',
  requires_editing: false,
  was_edited: false,
  content: ''
};

module.exports = data => {
  const output = [];

  data.forEach(project => {
    const allConditions = getAllConditions(project);

    if (allConditions.length > 0) {
      allConditions.map((condition, i) => {
        output.push({
          ...omit(project, 'conditions', 'protocols'),
          ...condition
        });
      });
    } else {
      output.push({
        ...omit(project, 'conditions', 'protocols'),
        ...missingCondition // csv takes headers from first row, make sure all props are present regardless
      });
    }
  });

  return output;
};
