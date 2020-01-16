const { Router } = require('express');
const form = require('@asl/pages/pages/common/routers/form');
const schema = require('../schema');

module.exports = () => {
  const app = Router();

  app.use('/', form({
    schema,
    process: (req, res, next) => {
      const day = req.body['newIssueDate-day'];
      const month = req.body['newIssueDate-month'];
      const year = req.body['newIssueDate-year'];

      Object.assign(req.form.values, {
        newIssueDate: `${year}-${month}-${day}`
      });
      next();
    }
  }));

  app.post('/', (req, res, next) => {
    return res.redirect(req.buildRoute('projectUpdateIssueDate', { suffix: 'confirm' }));
  });

  return app;
};
