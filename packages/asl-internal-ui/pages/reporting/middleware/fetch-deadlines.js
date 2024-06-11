const { Router } = require('express');
const reducer = require('../helpers/reduce-stream');
const { pick } = require('lodash');

module.exports = () => {

  const router = new Router();

  router.use((req, res, next) => {
    const slas = req.metrics('/reports/ppl-sla', { stream: true, query: pick(req.form.values, 'start', 'end') })
      .then(reducer(total => total + 1, 0))
      .then(total => {
        res.locals.model.deadlines = total;
      });
    res.await(slas);
    next();
  });

  router.use((req, res, next) => {
    const deadlines = req.metrics('/reports/internal-deadlines', { stream: true, query: pick(req.form.values, 'start', 'end') })
      .then(reducer((result, data) => {
        result.total++;
        const type = result[data.type];
        if (type) {
          type[data.resubmitted === 'Yes' ? 'resubmission' : 'first']++;
        }
        return result;
      }, {
        total: 0,
        application: {
          first: 0,
          resubmission: 0
        },
        amendment: {
          first: 0,
          resubmission: 0
        }
      }))
      .then(stats => {
        res.locals.model.internalDeadlines = stats;
      });
    res.await(deadlines);
    next();
  });

  return router;

};
