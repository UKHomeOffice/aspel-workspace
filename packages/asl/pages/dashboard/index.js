const { page } = require('@asl/service/ui');
const taskList = require('@asl/pages/pages/task/list/router');

function userIsNtcoAtEst(profile, estId) {
  return !!profile.roles.find(role => role.establishmentId === estId && role.type === 'ntco');
}

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

  app.get('/', (req, res, next) => {
    const adminOrNtcoEsts = req.user.profile.establishments.filter(est => est.role === 'admin' || userIsNtcoAtEst(req.user.profile, est.id));
    const adminEsts = adminOrNtcoEsts.filter(est => est.role === 'admin');

    const rasDue = Promise.all(
      adminEsts.map(est => {
        return Promise.resolve()
          .then(() => req.api(`/establishment/${est.id}/projects/ras-due?onlymeta=true`))
          .then(response => {
            return {
              estId: est.id,
              name: est.name,
              due: response.json.meta.count
            };
          });
      })
    );

    const pilReviewsDue = Promise.all(
      adminOrNtcoEsts.map(est => {
        return Promise.all([
          req.api(`/establishment/${est.id}/pils/reviews?status=due&onlymeta=true`),
          req.api(`/establishment/${est.id}/pils/reviews?status=overdue&onlymeta=true`)
        ])
          .then(response => {
            const due = response[0].json.meta.count;
            const overdue = response[1].json.meta.count;
            return {
              estId: est.id,
              name: est.name,
              overdue,
              due
            };
          });
      })
    );

    Promise.all([
      pilReviewsDue,
      rasDue
    ])
      .then(([reviews, rasDue]) => {
        res.locals.static.adminPilReviewsRequired = reviews.filter(r => r.overdue > 0 || r.due > 0);
        res.locals.static.rasDue = rasDue.filter(r => r.due > 0);
      })
      .then(() => next())
      .catch(err => {
        req.log('error', { message: err.message, stack: err.stack, ...err });
        // don't block dashboard rendering for failed PIL review lookup
        next();
      });
  });

  app.get('/', taskList());

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
