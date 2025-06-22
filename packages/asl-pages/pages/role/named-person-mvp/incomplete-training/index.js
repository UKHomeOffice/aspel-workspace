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
        const roleType = req.session.form[`${req.profile.id}-new-role-named-person`].values.type;
        req.form.schema = schema(roleType);
        next();
      },
      process: (req, res, next) => {
        const day = req.body['completeDate-day'];
        const month = req.body['completeDate-month'];
        const year = req.body['completeDate-year'];
        Object.assign(req.form.values, {
          completeDate: `${year}-${month}-${day}`
        });
        next();
      },
      locals: (req, res, next) => {
        Object.assign(res.locals.static, {
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
    return res.redirect(req.buildRoute('role.namedPersonMvp.confirm'));
  });

  return app;
};
