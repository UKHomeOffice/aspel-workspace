const { Router } = require('express');
const csv = require('csv-stringify');
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

module.exports = settings => {
  const router = Router({ mergeParams: true });

  router.get('/', (req, res, next) => {

    req.api(`/reports/ppl-conditions`)
      .then(result => {
        const stringifier = csv({
          header: true,
          columns: [
            'establishment',
            'licence_number',
            'title',
            'status',
            'issue_date',
            'level',
            'protocol_name',
            'type',
            'condition',
            'requires_editing',
            'was_edited',
            'content'
          ]
        });
        res.attachment('ppl-conditions.csv');

        result.json.data.forEach(project => {
          const allConditions = getAllConditions(project);

          if (allConditions.length > 0) {
            allConditions.map((condition, i) => {
              stringifier.write({
                ...omit(project, 'conditions', 'protocols'),
                ...condition
              });
            });
          } else {
            stringifier.write({
              ...omit(project, 'conditions', 'protocols'),
              condition: '-'
            });
          }
        });

        stringifier.pipe(res);
        return stringifier.end();
      })
      .catch(next);
  });

  return router;
};
