const { Router } = require('express');
const { get, omit, merge } = require('lodash');
const form = require('../../../common/routers/form');
const schema = require('../schema/declaration');
const experienceFields = require('../schema/experience-fields');
const { updateDataFromTask, redirectToTaskIfOpen } = require('../../../common/middleware');

const sendData = (req, params = {}) => {
  const values = get(req.session, `form.${req.model.id}.values`);
  const opts = {
    method: 'PUT',
    json: merge({
      data: {
        licenceHolderId: values.licenceHolderId
      },
      meta: omit(values, 'licenceHolderId', 'declaration-1')
    }, params)
  };

  return req.api(`/establishment/${req.establishmentId}/projects/${req.projectId}/update-licence-holder`, opts);
};

module.exports = () => {
  const app = Router();

  app.post('/', updateDataFromTask(sendData));

  app.use(form({
    schema,
    locals(req, res, next) {
      res.locals.static.fields = experienceFields.fields;
      res.locals.static.project = req.project;
      res.locals.static.values = get(req.session, `form.${req.model.id}.values`);
      req.api(`/establishment/${req.establishmentId}/profiles/${res.locals.static.values.licenceHolderId}`)
        .then(({ json: { data } }) => {
          res.locals.static.proposedLicenceHolder = data;
        })
        .then(() => next())
        .catch(next);
    }
  }));

  app.post('/', redirectToTaskIfOpen());

  app.post('/', (req, res, next) => {
    sendData(req)
      .then(() => {
        res.redirect(req.buildRoute('project.updateLicenceHolder', { suffix: 'success' }));
      })
      .catch(next);
  });

  return app;
};
