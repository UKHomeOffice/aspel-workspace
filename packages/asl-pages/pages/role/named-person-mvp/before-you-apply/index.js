const { page } = require('@asl/service/ui');
const { form } = require('../../../common/routers');

module.exports = (settings) => {
  const app = page({
    root: __dirname,
    ...settings
  });

  app.use(
    form({
      locals: (req, res, next) => {
        Object.assign(res.locals.static, {
          roleType: req.session.form[`${req.profile.id}-new-role-named-person`].values.type.toUpperCase(),
          trainingDashboardUrl: req.buildRoute('training.dashboard')
        });
        next();
      }
    })
  );

  app.post('/', (req, res, next) => {
    return res.redirect(req.buildRoute('role.namedPersonMvp.create'));
  });

  return app;
};
