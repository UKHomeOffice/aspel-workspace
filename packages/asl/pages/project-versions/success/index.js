const page = require('@asl/service/ui/page');
const success = require('@asl/pages/pages/common/routers/success');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    req.model = req.project;
    next();
  });

  app.use(success({ licence: 'project', status: 'resubmitted' }));

  app.use((req, res, next) => res.sendResponse());

  return app;
};
