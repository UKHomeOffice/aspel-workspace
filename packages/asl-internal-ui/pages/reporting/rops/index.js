const { page } = require('@asl/service/ui');
const { NotFoundError } = require('../../../lib/errors');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res, next) => {
    if (!req.user.profile.asruRops) {
      return next(new NotFoundError());
    }

    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    res.locals.static.year = year;

    return req.metrics('/rops', { stream: false, query: { year } })
      .then(ropsSummary => {
        res.locals.static.ropsSummary = ropsSummary;
      })
      .then(() => next())
      .catch(next);
  });

  return app;
};
