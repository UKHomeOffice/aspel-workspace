const { page } = require('@asl/service/ui');
const { NotFoundError } = require('../../../lib/errors');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.param('year', (req, res, next, year) => {
    req.year = parseInt(year, 10);
    res.locals.static.year = req.year;
    next();
  });

  app.get('/:year?', (req, res, next) => {
    if (!req.user.profile.asruRops) {
      return next(new NotFoundError());
    }
    next();
  });

  app.get('/:year?', (req, res, next) => {
    if (!req.year) {
      req.year = new Date().getFullYear();
    }

    console.log('YEAR:', req.year);

    return req.metrics('/rops', { stream: false, query: { year: req.year } })
      .then(ropsSummary => {
        res.locals.static.ropsSummary = ropsSummary;
      })
      .then(() => next())
      .catch(e => {
        console.log('oh noes!');
        console.log(e);
        next(e);
      });
  });

  return app;
};
