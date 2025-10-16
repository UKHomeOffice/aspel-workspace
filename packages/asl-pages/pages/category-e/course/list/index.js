const { page } = require('@asl/service/ui');
const { datatable } = require('../../../common/routers');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res, next) => {
    const pageContent = res.locals.static.content.landingPage;
    res.locals.pageTitle = `${pageContent.tabs.licences} - ${pageContent.title} - ${req.establishment.name}`;
    next();
  });

  app.use(datatable({
    configure: (req, res, next) => {
      req.datatable.sort = { column: 'startDate', ascending: true };
      next();
    },
    getApiPath: (req, res, next) => {
      req.datatable.apiPath = `/establishment/${req.establishmentId}/training-courses`;
      next();
    }
  })({ schema, defaultRowCount: 10 }));

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
