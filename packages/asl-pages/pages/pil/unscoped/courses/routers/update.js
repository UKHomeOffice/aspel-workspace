const { Router } = require('express');
const dayJs = require('@ukhomeoffice/asl-components/dayjs');
const { STRICT_DATE_FORMATS, formatIsoDate, parseDate } = dayJs;
const { form } = require('../../../../common/routers');
const schema = require('../schema/update');

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.use(form({
    schema,
    getValues: (req, res, next) => {
      const projectId = req.form.values.projectId;
      if (!projectId) {
        return next();
      }
      req.api(`/establishment/${req.establishmentId}/projects/${projectId}`)
        .then(response => response.json.data)
        .then(project => {
          req.form.schema.projectId.defaultValue = project.licenceNumber;
          next();
        })
        .catch(next);
    },
    process: (req, res, next) => {
      const day = req.body['startDate-day'];
      const month = req.body['startDate-month'];
      const year = req.body['startDate-year'];

      Object.assign(req.form.values, {
        startDate: `${year}-${month}-${day}`
      });

      next();
    },
    saveValues: (req, res, next) => {
      req.session.form[req.model.id].values.startDate = formatIsoDate(parseDate(req.form.values.startDate, STRICT_DATE_FORMATS, true));
      next();
    }
  }));

  return app;
};
