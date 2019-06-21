const { Router } = require('express');
const { isUndefined, omit } = require('lodash');
const form = require('../../../common/routers/form');
const getSchema = require('../schema');
const experienceFields = require('../schema/experience-fields');

module.exports = () => {
  const app = Router();

  app.use(form({
    configure(req, res, next) {
      req.api(`/establishment/${req.establishmentId}/profiles`)
        .then(({ json: { data } }) => {
          req.form.schema = {
            ...getSchema(data),
            ...experienceFields.fieldNames.reduce((obj, field) => ({ ...obj, [field]: {} }), {})
          };
        })
        .then(() => next())
        .catch(next);
    },
    process(req, res, next) {
      if (!isUndefined(req.form.values['experience-projects'])) {
        req.form.values['experience-projects'] = req.form.values['experience-projects'] === 'true';
      }
      next();
    },
    locals(req, res, next) {
      res.locals.static.schema = omit(req.form.schema, experienceFields.fieldNames);
      res.locals.static.fields = experienceFields.fields;
      res.locals.static.project = req.project;
      next();
    }
  }));

  app.post('/', (req, res, next) => {
    res.redirect(req.buildRoute('project.updateLicenceHolder.confirm'));
    next();
  });

  return app;
};
