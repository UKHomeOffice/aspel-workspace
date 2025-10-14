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
      req.datatable.sort = { column: 'updatedAt', ascending: false };
      next();
    },
    getApiPath: (req, res, next) => {
      const query = {
        model: 'trainingPil',
        establishment: req.establishmentId,
        searchFields: [
          'data.modelData.profile.firstName',
          'data.modelData.profile.lastName',
          'data.modelData.profile.email'
        ]
      };
      req.datatable.apiPath = ['/tasks/filtered', { query }];
      next();
    }
  })({ schema, defaultRowCount: 10 }));

  return app;
};
