const fetch = require('r2');
const { pipeline } = require('stream');
const ndjson = require('ndjson');
const through = require('through2');

const { Router } = require('express');
const csv = require('csv-stringify');
const conditionsReportMapper = require('./conditions-report-mapper');

const process = report => (data, encoding, callback) => {
  try {
    switch (report) {
      case 'ppl-conditions':
        return callback(null, conditionsReportMapper(data));
      default:
        return callback(null, data);
    }
  } catch(e) {
    return callback(e);
  }
};

module.exports = settings => {
  const router = Router({ mergeParams: true });

  router.get('/', (req, res, next) => {
    const report = req.params.report;

    // res.attachment(`${report}.csv`);
    const stringifier = csv({ header: true });

    const headers = {
      Authorization: `bearer ${req.user.access_token}`,
      'Content-type': 'application/json'
    };

    fetch(`http://localhost:8089/reports/${report}`, { headers }).response
      .then(response => {
        pipeline(
          response.body,
          ndjson.parse(),
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
