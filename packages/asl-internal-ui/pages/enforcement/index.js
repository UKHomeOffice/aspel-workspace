const { Router } = require('express');
const { validateUuidParam } = require('@asl/pages/pages/common/middleware');
const routes = require('./routes');

module.exports = settings => {
  const router = Router({ mergeParams: true });

  router.param('caseId', (req, res, next, caseId) => {
    if (caseId === 'create') {
      return next('route');
    }
    next();
  });

  router.param('caseId', validateUuidParam());

  router.param('caseId', (req, res, next, caseId) => {
    return req.api(`/enforcement/${caseId}`)
      .then(({ json: { data } }) => {
        req.enforcementCase = data;
      })
      .then(() => next())
      .catch(next);
  });

  return router;
};

module.exports.routes = routes;
