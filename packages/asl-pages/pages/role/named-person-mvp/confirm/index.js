const { page } = require('@asl/service/ui');
const form = require('../../../common/routers/form');

module.exports = (settings) => {
  const app = page({
    root: __dirname,
    ...settings
  });

  app.use((req, res, next) => {
    req.model = {
      id: `${req.profile.id}-declaration`
    };
    next();
  });

  app.use(
    form({
      requiresDeclaration: (req) => !req.user.profile.asruUser,
      locals: (req, res, next) => {
        Object.assign(res.locals.static, {
          values: {
            ...req.session.form[`${req.profile.id}-new-role-named-person`]
              .values
          }
        });
        next();
      },
      saveValues: (req, res, next) => {
        req.session.form[req.model.id].values = req.form.values;
        next();
      }
    })
  );

  app.post('/', (req, res, next) => {
    return res.redirect(req.buildRoute('role.namedPersonMvp.success'));
  });

  return app;
};
