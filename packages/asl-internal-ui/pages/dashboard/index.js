const { page } = require('@asl/service/ui');
const taskList = require('@asl/pages/pages/task/list/router');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname,
    paths: ['/search']
  });

  app.get('/', (req, res, next) => {
    res.locals.static.profile = req.user.profile;
    res.locals.static.searchType = req.query.searchType || 'establishments';
    next();
  });

  app.get('/', taskList());
  app.get('/search', require('./routers/search'));

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
