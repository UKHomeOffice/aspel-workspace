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
      id: `${req.profile.id}-nvs-module`,
      ...buildModel(schema)
    };
    next();
  });

  app.use(
    form({
      configure(req, res, next) {
        req.form.schema = schema();
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
