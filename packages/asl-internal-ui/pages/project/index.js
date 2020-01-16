const { Router } = require('express');
const isUUID = require('uuid-validate');
const { NotFoundError } = require('@asl/service/errors');
const routes = require('./routes');

module.exports = settings => {
  const app = Router({ mergeParams: true });

  app.param('projectId', (req, res, next, projectId) => {
    if (!isUUID(projectId)) {
      return next(new NotFoundError());
    }
    req.projectId = projectId;

    console.log(`found projectId param: ${projectId}`);

    return req.api(`/establishment/${req.establishmentId}/projects/${projectId}`)
      .then(({ json: { data, meta } }) => {
        req.project = data;
        req.project.openTasks = meta.openTasks;
        req.establishment = meta.establishment;
        res.locals.static.project = req.project;
      })
      .then(() => next())
      .catch(next);
  });

  return app;
};

module.exports.routes = routes;
