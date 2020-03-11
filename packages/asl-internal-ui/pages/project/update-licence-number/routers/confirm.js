const { Router } = require('express');
const { get } = require('lodash');

module.exports = () => {
  const app = Router();

  app.use('/', (req, res, next) => {
    res.locals.model = req.model;
    res.locals.static.licenceNumber = get(req.session.form[req.model.id], 'values.licenceNumber');
    next();
  });

  app.post('/', (req, res, next) => {
    const opts = {
      method: 'PUT',
      json: {
        data: {
          licenceNumber: get(req.session.form[req.model.id], 'values.licenceNumber')
        }
      }
    };

    return req.api(`/project/${req.projectId}/licence-number`, opts)
      .then(() => {
        delete req.session.form[req.model.id];
        req.notification({ key: 'licenceNumberUpdated' });
        return res.redirect(req.buildRoute('project.read'));
      })
      .catch(next);
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
