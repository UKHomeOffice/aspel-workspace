const { Router } = require('express');
const { pipeline } = require('stream');
const through = require('through2');
const csv = require('csv-stringify');
const moment = require('moment');
const { countBy } = require('lodash');

const content = require('./content');

const fetchTasks = req => {
  return req.metrics('/reports/tasks', { stream: true, query: req.query })
    .then(stream => {
      const tasksByDate = {};
      const tasksByType = {};
      return new Promise((resolve, reject) => {
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
              return reject(err);
            }
            resolve({ tasksByType, tasksByDate });
          }
        );
      });
    });
};

const fetchExpirations = req => {
  return req.metrics('/reports/ppl-expirations', { stream: true, query: req.query })
    .then(stream => {
      return new Promise((resolve, reject) => {
        const expirations = {};
        pipeline(
          stream,
          through.obj((data, enc, callback) => {
            const date = moment(data.expiry_date).startOf('week').format('YYYY-MM-DD');
            expirations[date] = expirations[date] || [];
            expirations[date].push(data);
            callback();
          }),
          err => {
            if (err) {
              return reject(err);
            }
            resolve(expirations);
          }
        );
      });
    });
};

module.exports = settings => {
  const router = Router();

  router.get('/', (req, res, next) => {
    Promise.all([ fetchTasks(req), fetchExpirations(req) ])
      .then(([ tasks, expirations ]) => {
        req.tasksByType = tasks.tasksByType;
        req.tasksByDate = tasks.tasksByDate;
        req.expirations = expirations;
        next();
      })
      .catch(next);

  });

  router.get('/', (req, res, next) => {
    const types = Object.keys(content);

    const stringifier = csv({ bom: true });
    res.attachment('tasks.csv');

    const heading = types.map(type => content[type]);
    stringifier.write([ 'Week commencing', ...heading, 'Total tasks' ]);
    let date = moment(req.query.start, 'YYYY-MM-DD').startOf('week');
    const end = moment(req.query.end, 'YYYY-MM-DD');

    while (date.isBefore(end)) {
      const isoDate = date.format('YYYY-MM-DD');
      const metricsByType = countBy(req.tasksByDate[isoDate], 'type');
      const row = types.map(type => {
        if (type === 'project-expiry') {
          return (req.expirations[isoDate] || []).length;
        }
        return metricsByType[type] || 0;
      });
      stringifier.write([ isoDate, ...row, (req.tasksByDate[isoDate] || []).length ]);
      date = date.add(1, 'week');
    }

    const totals = types.map(type => {
      if (type === 'project-expiry') {
        return Object.values(req.expirations).reduce((sum, arr) => sum + arr.length, 0);
      }
      return (req.tasksByType[type] || []).length;
    });
    const total = totals.reduce((sum, num) => sum + num, 0);
    stringifier.write([ 'Total', ...totals, total ]);

    stringifier.pipe(res);
    return stringifier.end();

  });

  return router;
};
