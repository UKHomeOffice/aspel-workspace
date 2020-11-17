const { Router } = require('express');
const { pipeline } = require('stream');
const through = require('through2');
const csv = require('csv-stringify');
const moment = require('moment');
const { countBy } = require('lodash');

const content = require('./content');

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
            let model = data.model;
            let action = data.action;

            if (model === 'project' && data.schemaVersion === 0) {
              model = 'legacy-project';
            }

            if (model === 'trainingPil') {
              model = 'pil'; // count training PIL tasks as PIL tasks
            }

            const type = `${model}-${action}`;

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
    const types = Object.keys(content);

    const stringifier = csv();
    res.attachment('tasks.csv');

    const heading = types.map(type => content[type]);
    stringifier.write([ 'Week commencing', ...heading, 'Total' ]);
    let date = moment(req.query.start, 'YYYY-MM-DD').startOf('week');
    const end = moment(req.query.end, 'YYYY-MM-DD');

    while (date.isBefore(end)) {
      const isoDate = date.format('YYYY-MM-DD');
      const metricsByType = countBy(req.tasksByDate[isoDate], 'type');
      const row = types.map(type => metricsByType[type] || 0);
      stringifier.write([ isoDate, ...row, (req.tasksByDate[isoDate] || []).length ]);
      date = date.add(1, 'week');
    }

    const totals = types.map(type => (req.tasksByType[type] || []).length);
    const total = totals.reduce((sum, num) => sum + num, 0);
    stringifier.write([ 'Total', ...totals, total ]);

    stringifier.pipe(res);
    return stringifier.end();

  });

  return router;
};
