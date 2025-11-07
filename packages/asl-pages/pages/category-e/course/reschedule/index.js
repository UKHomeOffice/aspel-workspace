const { page } = require('@asl/service/ui');

module.exports = settings => {
  const app = page({ ...settings, root: __dirname });

  app.get('/', (req, res, next) => {
    res.locals.pageTitle = `${res.locals.static.content.pageTitle} - ${req.trainingCourse?.title}`;
    next();
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
