const { Router } = require('express');
const dayJs = require('@ukhomeoffice/asl-components/dayjs');
const { get } = require('lodash');

module.exports = () => {
  const app = Router();

  app.use('/', (req, res, next) => {
    const newIssueDate = new Date(get(req.session.form[req.model.id], 'values.newIssueDate'));
    const duration = get(req.model, 'granted.duration');
    req.model.newIssueDate = newIssueDate.toISOString();
    req.model.newExpiryDate = dayJs(newIssueDate).add(duration).toISOString();
    res.locals.model = req.model;
    next();
  });

  app.post('/', (req, res, next) => {
    const newIssueDate = new Date(get(req.session.form[req.model.id], 'values.newIssueDate'));

    const opts = {
      method: 'PUT',
      json: {
        data: {
          issueDate: newIssueDate.toISOString()
        }
      }
    };

    return req.api(`/project/${req.projectId}/issue-date`, opts)
      .then(() => {
        delete req.session.form[req.model.id];
        req.notification({ key: 'issueDateUpdated' });
        return res.redirect(req.buildRoute('project.read'));
      })
      .catch(next);
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
