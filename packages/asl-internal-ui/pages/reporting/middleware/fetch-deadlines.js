const { Router } = require('express');
const { pipeline } = require('stream');
const through = require('through2');
const { pick } = require('lodash');

module.exports = () => {

  const router = new Router();

  router.use((req, res, next) => {
    req.metrics('/reports/ppl-sla', { stream: true, query: pick(req.form.values, 'start', 'end') })
      .then(stream => {
        let total = 0;
        return new Promise((resolve, reject) => {
          pipeline(
            stream,
            through.obj((data, enc, callback) => {
              total++;
              callback();
            }),
            err => {
              if (err) {
                return reject(err);
              }
              resolve(total);
            }
          );
        });
      })
      .then(total => {
        res.locals.model.deadlines = total;
      })
      .then(() => next())
      .catch(next);
  });

  router.use((req, res, next) => {
    req.metrics('/reports/internal-deadlines', { stream: true, query: pick(req.form.values, 'start', 'end') })
      .then(stream => {
        const stats = {
          total: 0,
          application: {
            first: 0,
            resubmission: 0
          },
          amendment: {
            first: 0,
            resubmission: 0
          }
        }
        return new Promise((resolve, reject) => {
          pipeline(
            stream,
            through.obj((data, enc, callback) => {
              stats.total++;
              const type = stats[data.type];
              if (type) {
                type[data.resubmitted === 'Yes' ? 'resubmission' : 'first']++;
              }
              callback();
            }),
            err => {
              if (err) {
                return reject(err);
              }
              resolve(stats);
            }
          );
        });
      })
      .then(stats => {
        res.locals.model.internalDeadlines = stats;
      })
      .then(() => next())
      .catch(next);
  });

  return router;

}
