const { Router } = require('express');
const { form } = require('../../../common/routers');

const FORM_ID = 'new-role-named-person';

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.use(
    form({
      locals: (req, res, next) => {
        Object.assign(res.locals.static, {
          roleType: req.session?.form?.[FORM_ID]?.values?.type?.toUpperCase() || 'default',
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
