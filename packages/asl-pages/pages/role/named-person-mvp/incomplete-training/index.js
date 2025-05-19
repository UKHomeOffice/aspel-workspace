const { page } = require('@asl/service/ui');
const { form } = require('../../../common/routers');
const { buildModel } = require('../../../../lib/utils');
const schema = require('./schema');

module.exports = (settings) => {
  const app = page({
    root: __dirname,
    ...settings
  });

  app.use((req, res, next) => {
    req.model = {
      id: `${req.profile.id}-incomplete-training`,
      ...buildModel(schema)
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
        Object.assign(res.locals, { model: req.model });
        Object.assign(res.locals.static, {
          profile: req.profile,
          roleType: req.session.form[`${req.profile.id}-new-role-named-person`].values.type.toUpperCase()
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
  });

  return app;
};
