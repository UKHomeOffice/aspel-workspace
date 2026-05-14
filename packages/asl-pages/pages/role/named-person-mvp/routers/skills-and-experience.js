const { form } = require('../../../common/routers');
const { Router } = require('express');
const schema = require('../schema').skillsAndExperience;
const applyRoleSpecificValidationErrors = require('../helpers/skills-and-experience-validation-errors');

module.exports = ({ formId }) => {
  const app = Router({ mergeParams: true });

  app.use(
    form({
      configure(req, res, next) {
        const roleType = req.session.form[formId].values.type;
        req.form.schema = schema(roleType);
        next();
      },
      getValidationErrors: (req, res, next) => {
        req.form.validationErrors = applyRoleSpecificValidationErrors(
          req.session.form[formId].values.type,
          req.form.validationErrors
        );
        next();
      },
      locals: (req, res, next) => {
        Object.assign(res.locals.static, {
          roleType: req.session.form[formId].values.type.toUpperCase()
        });
        next();
      }
    })
  );

  app.post('/', (req, res, next) => {
    return res.redirect(req.buildRoute('role.namedPersonMvp', { suffix: 'confirm' }));
  });

  return app;
};
