const { form } = require('../../../common/routers');
const { Router } = require('express');
const schema = require('../schema').skillsAndExperience;

module.exports = ({ formId }) => {
  const app = Router({ mergeParams: true });

  app.use(
    form({
      configure(req, res, next) {
        req.form.schema = schema();
        next();
      },
      locals: (req, res, next) => {
        Object.assign(res.locals.static, {
          roleType: req.session.form[formId].values.type.toUpperCase()
        });
        next();
      },
      saveValues: (req, res, next) => {
        req.session.form[formId].values = { ...req.session.form[formId].values, ...req.form.values };
        next();
      }
    })
  );

  app.post('/', (req, res, next) => {
    return res.redirect(req.buildRoute('role.namedPersonMvp.confirm'));
  });

  return app;
};
