const { page } = require('@asl/service/ui');
const datatable = require('@asl/pages/pages/common/routers/datatable');
const schemas = require('./schema');
const NotFoundError = require('../../lib/errors/not-found');

const searchableModels = [
  'establishments',
  'people',
  'projects'
];

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use('/', (req, res, next) => {
    req.breadcrumb('search.base');
    res.locals.static.profile = req.user.profile;
    res.locals.static.searchType = req.query.searchType;
    res.locals.static.searchableModels = req.query.searchableModels;
    next();
  });

  app.use((req, res, next) => {
    if (!req.query.filters) {
      return next('router'); // skip the datatable router if no search has been performed
    }
    next();
  });

  app.use('/', datatable({
    configure: (req, res, next) => {
      const searchType = req.query.searchType;
      req.datatable.searchType = searchType;
      req.datatable.schema = schemas[searchType];

      if (searchType && !searchableModels.includes(searchType)) {
        return next(new NotFoundError());
      }

      switch (searchType) {
        case 'people':
          req.datatable.apiPath = `/search/profiles`;
          break;

        case 'projects':
          req.datatable.apiPath = `/search/projects`;
          break;

        default:
          req.datatable.apiPath = `/search/establishments`;
          break;
      }
      next();
    }
  })());

  return app;
};
