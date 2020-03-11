const { Router } = require('express');
const routes = require('./routes');

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.use((req, res, next) => {
    // prevent double breadcrumbs if this falls through to pages
    // enabling breadcrumbs in lib/routes.js doesn't display project.list breadcrumb
    if (req.url.match('update-issue-date') || req.url.match('update-licence-number')) {
      req.breadcrumb('project.list');
      req.breadcrumb('project.read');
    }
    next();
  });

  return app;
};

module.exports.routes = routes;
