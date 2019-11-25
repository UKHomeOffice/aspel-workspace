const { merge } = require('lodash');
const { page } = require('@asl/service/ui');
const datatable = require('@asl/pages/pages/common/routers/datatable');
const schemas = require('./schema');
const NotFoundError = require('../../lib/errors/not-found');
const content = require('./content');

const searchableModels = ['establishments', 'profiles', 'projects'];

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    req.searchType = req.params.searchType || searchableModels[0];
    if (req.searchType && !searchableModels.includes(req.searchType)) {
      return next(new NotFoundError());
    }
    next();
  });

  app.use((req, res, next) => {
    res.locals.static.content = merge({}, res.locals.static.content, content(req.searchType));
    res.locals.static.profile = req.user.profile;
    res.locals.static.searchType = req.searchType;
    res.locals.static.searchableModels = req.query.searchableModels;
    next();
  });

  app.use(datatable({
    configure: (req, res, next) => {
      const searchType = req.searchType;

      if (searchType && !searchableModels.includes(searchType)) {
        return next(new NotFoundError());
      }

      req.datatable.searchType = searchType;
      req.datatable.schema = schemas[searchType];
      req.datatable.apiPath = `/search/${searchType}`;

      next();
    }
  })());

  app.get('/', (req, res) => res.sendResponse())

  return app;
};
