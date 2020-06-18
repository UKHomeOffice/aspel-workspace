const { Router } = require('express');
const { pipeline } = require('stream');
const through = require('through2');
const csv = require('csv-stringify');

const metrics = require('../../../lib/middleware/metrics');
const conditionsReportMapper = require('./conditions-report-mapper');

const process = report => (data, encoding, callback) => {
  try {
    switch (report) {
      case 'ppl-conditions':
        return callback(null, conditionsReportMapper(data));
      default:
        return callback(null, data);
    }
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
    const stringifier = csv({ header: true });

    req.metrics(`/reports/${report}`)
      .then(stream => {
        pipeline(
          stream,
          through.obj(process(report)),
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
