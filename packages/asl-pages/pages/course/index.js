const { Router } = require('express');
const { FEATURE_FLAG_CAT_E } = require('@asl/service/ui/feature-flag');
const routes = require('./routes');

module.exports = settings => {
  const app = Router({ mergeParams: true });

  app.use(
    (req, res, next) => {
      if (!req.hasFeatureFlag(FEATURE_FLAG_CAT_E)) {
        return res.redirect(req.buildRoute('pils.courses.list'));
      }

      if (!req.establishment?.isTrainingEstablishment) {
        return res.redirect(req.buildRoute('establishment.dashboard'));
      }

      next();
    });

  return app;
};

module.exports.routes = routes;
