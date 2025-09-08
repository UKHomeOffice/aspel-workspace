const { Router } = require('express');
const { FEATURE_FLAG_CAT_E } = require('@ukhomeoffice/asl-constants/constants/feature-flags');
const routes = require('./routes');

module.exports = settings => {
  const app = Router({ mergeParams: true });

  app.use(
    (req, res, next) => {
      if (!req.hasFeatureFlag(FEATURE_FLAG_CAT_E)) {
        return res.redirect(req.buildRoute('pil.unscoped.courses.list'));
      }

      if (!req.establishment?.isTrainingEstablishment) {
        return res.redirect(req.buildRoute('establishment.dashboard'));
      }

      next();
    });

  return app;
};

module.exports.routes = routes;
