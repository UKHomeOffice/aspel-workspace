const Cacheable = require('./cacheable');
const { ref } = require('objection');
const { get, isUndefined } = require('lodash');

module.exports = settings => {

  const { Project } = settings.models;
  const cache = Cacheable();

  return c => {
    const model = get(c, 'data.model');
    const action = get(c, 'data.action');

    if (model === 'project' && (action === 'grant' || action === 'transfer')) {
      const continuation = get(c, 'data.continuation');
      // continuation added on init, noop.
      if (!isUndefined(continuation)) {
        return c;
      }

      const projectId = get(c, 'data.id');
      if (!projectId) {
        return c;
      }

      return cache.query(Project, projectId)
        .then(project => {
          if (!project) {
            return c;
          }
          return project.$relatedQuery('version')
            .orderBy('createdAt', 'desc')
            .first()
            .select(
              ref('data:transfer-expiring')
                .castBool()
                .as('expiring'),
              ref('data:project-continuation')
                .castJson()
                .as('continuation')
            );
        })
        .then(({ continuation, expiring }) => {
          if (!expiring) {
            return c;
          }
          return {
            ...c,
            data: {
              ...c.data,
              continuation
            }
          };
        });
    }

    return c;

  };
};
