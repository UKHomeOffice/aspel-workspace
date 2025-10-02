const { page } = require('@asl/service/ui');
const { form } = require('../../../common/routers');
const { set } = require('lodash');

module.exports = (settings) => {
  const app = page({
    root: __dirname,
    ...settings
  });

  app.use(
    form({
      locals: (req, res, next) => {
        set(
          res.locals,
          'static.trainingDashboardUrl',
          req.buildRoute('training.dashboard')
        );
        next();
      }
    })
  );

  app.post('/', (req, res, next) => {
    return res.redirect(req.buildRoute('role.namedPersonMvp.create'));
  });

  return app;
};
