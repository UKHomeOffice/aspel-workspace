const { Router } = require('express');
const { pipeline } = require('stream');
const through = require('through2');
const csv = require('csv-stringify');
const moment = require('moment');
const { countBy } = require('lodash');

const content = require('../content');

module.exports = settings => {
  const router = Router();

  router.get('/', (req, res, next) => {

    req.metrics('/reports/tasks', { stream: true, query: req.query })
      .then(stream => {
        const tasksByDate = {};
        const tasksByType = {};
        pipeline(
          stream,
          through.obj((data, enc, callback) => {
            let type = `${data.model}-${data.action}`;
            if (data.model === 'project' && data.schemaVersion === 0) {
              type = `legacy-project-${data.action}`;
            }

            const date = moment(data.updatedAt).startOf('week').format('YYYY-MM-DD');
            tasksByDate[date] = tasksByDate[date] || [];
            tasksByType[type] = tasksByType[type] || [];

            tasksByDate[date].push({ ...data, type });
            tasksByType[type].push({ ...data, type });

            callback();
          }),
          err => {
            if (err) {
              return next(err);
            }
            req.tasksByType = tasksByType;
            req.tasksByDate = tasksByDate;
            next();
          }
        );
      })
      .catch(next);
  });

  router.get('/', (req, res, next) => {

    const types = res.locals.static.types;
    const stringifier = csv();
    res.attachment('tasks.csv');

    const heading = types.map(type => content[type]);
    stringifier.write([ 'Week commencing', ...heading, 'Total' ]);
    let date = moment(res.locals.static.since, 'YYYY-MM-DD').startOf('week');
    const now = moment();

    while (date.isBefore(now)) {
      const isoDate = date.format('YYYY-MM-DD');
      const metricsByType = countBy(req.tasksByDate[isoDate], 'type');
      const row = types.map(type => metricsByType[type] || 0);
      stringifier.write([ isoDate, ...row, (req.tasksByDate[isoDate] || []).length ]);
      date = date.add(1, 'week');
    }

    const totals = types.map(type => (req.tasksByType[type] || []).length);
    stringifier.write([ 'Total', ...totals ]);

    stringifier.pipe(res);
    return stringifier.end();

  });

  return router;
};
