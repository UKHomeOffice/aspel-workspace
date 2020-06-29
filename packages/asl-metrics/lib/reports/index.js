const { Router } = require('express');
const { pipeline } = require('stream');
const through = require('through2');
const { flatten } = require('lodash');

const getWorkflowStatuses = require('../middleware/get-workflow-statuses');

const pils = require('./pils');
const pilReviews = require('./pil-reviews');
const namedPeople = require('./named-people');
const pplList = require('./ppl-list');
const pplSLA = require('./ppl-sla');
const pplConditions = require('./ppl-conditions');
const nts = require('./nts');
const tasks = require('./tasks');

// converts a simple object mapper function into a stream handler using `through` stream middleware
const step = fn => {
  return through.obj(function (record, enc, callback) {
    Promise.resolve()
      .then(() => fn(record))
      .then(result => {
        if (Array.isArray(result)) {
          result.forEach(r => this.push(r));
        } else {
          this.push(result);
        }
      })
      .then(() => callback())
      .catch(callback);
  });
};

module.exports = (settings) => {

  const router = Router({ mergeParams: true });

  const reports = {
    'pils': pils,
    'pil-reviews': pilReviews,
    'named-people': namedPeople,
    'ppl-list': pplList,
    'ppl-sla': pplSLA,
    'ppl-conditions': pplConditions,
    'nts': nts,
    'tasks': tasks
  };

  router.use(getWorkflowStatuses(settings));

  router.get('/:report', (req, res, next) => {

    const handler = reports[req.params.report];
    if (handler) {
      const report = handler(req);
      const stream = req.query.stream !== 'false';

      if (stream) {
        // serve a newline delimited json stream
        res.set('Content-type', 'application/json');
        return pipeline(
          report.query().stream(),
          step(record => report.parse(record)),
          step(record => JSON.stringify(record) + '\n'),
          res,
          e => e && next(e)
        );
      } else {
        // serve a complete json response
        return report.query()
          .then(result => Promise.all(result.map(report.parse)))
          .then(result => flatten(result))
          .then(result => res.json(result))
          .catch(next);
      }
    }
    next();
  });

  return router;
};
