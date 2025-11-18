const { page } = require('@asl/service/ui');
const { datatable } = require('../../../common/routers');
const schema = require('./schema');
const { readFlashMiddleware } = require('@asl/service/lib/middleware/flash-middleware');

module.exports = settings => {
  const app = page({ ...settings, root: __dirname });

  app.get('/', (req, res, next) => {
    res.locals.pageTitle = `${res.locals.static.content.pageTitle} - ${req.trainingCourse?.title}`;
    next();
  });

  app.use(datatable({
    getApiPath: (req, res, next) => {
      const query = {
        model: 'trainingCourse',
        modelId: req.trainingCourseId,
        establishmentId: req.establishmentId,
        action: 'grant'
      };
      req.datatable.apiPath = ['/tasks/related', { query }];
      next();
    }
  })({ schema, defaultRowCount: 50 }));

  app.get('/', readFlashMiddleware);

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
