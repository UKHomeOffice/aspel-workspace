const { Router } = require('express');
const { pipeline } = require('stream');
const through = require('through2');
const csv = require('csv-stringify');

const metrics = require('../../../lib/middleware/metrics');

const process = (data, encoding, callback) => {
  try {
    return callback(null, data);
  } catch (e) {
    return callback(e);
  }
};

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
        // noinspection JSCheckFunctionSignatures - through.obj inspects args to determine behaviour
        pipeline(
          stream,
          through.obj(process),
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
