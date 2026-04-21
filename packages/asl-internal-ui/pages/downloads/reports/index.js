const { Router } = require('express');
const { pipeline } = require('stream');
const csv = require('csv-stringify');

const metrics = require('../../../lib/middleware/metrics');

module.exports = settings => {
  const router = Router({ mergeParams: true });

  router.use(metrics(settings));

  router.get('/', (req, res, next) => {
    const report = req.params.report;

    res.attachment(`${report}.csv`);
    const stringifier = csv({
      bom: true,
      header: true
    });

    req.metrics(`/reports/${report}`, { query: req.query })
      .then(stream => {
        pipeline(
          stream,
          stringifier,
          res,
          err => {
            err && next(err);
          }
        );
      })
      .catch(next);

  });

  return router;
};
