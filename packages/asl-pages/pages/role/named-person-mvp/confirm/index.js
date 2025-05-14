const { page } = require('@asl/service/ui');
const form = require('../../../common/routers/form');
const schema = require('./schema');

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
      configure(req, res, next) {
        const role =
          req.session.form[`${req.profile.id}-new-role-named-person`].values;
        req.form.schema = schema(role);
        next();
      },
      locals: (req, res, next) => {
        Object.assign(res.locals.static, {
          values: {
            ...req.session.form[`${req.profile.id}-new-role-named-person`]
              .values
          }
        });
        next();
      }
    })
  );

  app.post('/', (req, res, next) => {
    return res.redirect(req.buildRoute('training.dashboard'));
  });

  return app;
};
