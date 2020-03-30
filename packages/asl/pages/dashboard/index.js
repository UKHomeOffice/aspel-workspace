const { page } = require('@asl/service/ui');
const taskList = require('@asl/pages/pages/task/list/router');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res, next) => {
    res.locals.static.profile = req.user.profile;
    next();
  });

  app.get('/', (req, res, next) => {
    const pil = req.user.profile.pil;

    if (!pil) {
      return next();
    }

    if (pil.reviewDue) {
      const params = {
        establishmentId: pil.establishmentId,
        profileId: pil.profileId,
        pilId: pil.id
      };
      res.locals.static.pilReviewRequired = {
        pilUrl: req.buildRoute('pil.read', params),
        overdue: pil.reviewOverdue
      };
    }

    next();
  });

  app.get('/', taskList());

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
