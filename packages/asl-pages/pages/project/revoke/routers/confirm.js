const { Router } = require('express');
const { get } = require('lodash');
const form = require('../../../common/routers/form');

module.exports = () => {
  const app = Router();

  app.use(form({
    locals(req, res, next) {
      res.locals.model = get(req.session, `form.${req.model.id}.values`);
      res.locals.static.project = req.project;
      next();
    }
  }));

  app.post('/', (req, res, next) => {
    const comments = get(req.session, `form.${req.model.id}.values.comments`);
    const params = {
      method: 'PUT',
      json: {
        meta: {
          comments
        }
      }
    };
    req.api(`/establishment/${req.establishmentId}/projects/${req.projectId}/revoke`, params)
      .then(response => {
        delete req.session.form[req.model.id];
        req.session.success = {
          taskId: get(response, 'json.data.id')
        };
        return res.redirect(req.buildRoute('project.revoke', { suffix: 'success' }));
      })
      .catch(next);
  });

  return app;
};
