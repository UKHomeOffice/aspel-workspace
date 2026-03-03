const { Router } = require('express');
const { clearSessionIfNotFromTask } = require('../../../common/middleware');
const { buildModel } = require('../../../../lib/utils');
const { PELH_OR_NPRC_ROLES } = require('../../helper');
const schema = require('../schema');

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.use((req, res, next) => {
    req.model = {
      ...buildModel(schema)
    };
    next();
  });

  app.get('/', clearSessionIfNotFromTask());

  app.use('/', (req, res, next) => {
    const query = {
      model: 'establishment',
      modelId: req.establishmentId,
      onlyOpen: true,
      action: 'replace'
    };

    req
      .api('/tasks/related', { query })
      .then((response) => {
        return response.json.data || [];
      })
      .then((data) => {
        res.locals.static.pelhOrNprcTasks = data
          .filter((task) => PELH_OR_NPRC_ROLES.includes(task.data.data.type))
          .map((task) => ({
            id: task.id,
            type: task.data.data.type
          }));
        next();
      })
      .catch(next);
  });

  app.post('/', (req, res, next) => {
    return res.redirect(
      req.buildRoute('role.namedPersonMvp', { suffix: 'before-you-apply' })
    );
  });

  return app;
};
