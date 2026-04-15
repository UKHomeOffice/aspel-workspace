const { Router } = require('express');
const { form } = require('../../../common/routers');
const { MANDATORY_TRAINING_ROLE_TYPES } = require('../role-types');

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
    const roles = req.session.form[FORM_ID].values;
    if (MANDATORY_TRAINING_ROLE_TYPES.includes(roles.type.toLowerCase())) {
      return res.redirect(req.buildRoute('role.namedPersonMvp', { suffix: 'mandatory-training' }));
    } else if (roles.type.toLowerCase() === 'nio' || roles.type.toLowerCase() === 'ntco' || roles.type.toLowerCase() === 'nprc') {
      return res.redirect(req.buildRoute('role.namedPersonMvp', { suffix: 'skills-and-experience' }));
    }
    return res.redirect(req.buildRoute('role.namedPersonMvp', { suffix: 'select-role' }));
  });

  return app;
};
