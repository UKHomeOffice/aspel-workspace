const csv = require('csv-stringify');
const { groupBy, countBy } = require('lodash');
const moment = require('moment');

const content = require('../content');

module.exports = ({ types }) => (req, res, next) => {
  if (req.query.csv) {
    const stringifier = csv();
    res.attachment('tasks.csv');

    const metricsByDate = groupBy(res.locals.static.metrics.tasks, task => moment(task.updatedAt).startOf('week').format('YYYY-MM-DD'));
    const allMetricsByType = countBy(res.locals.static.metrics.tasks, 'type');

    const heading = types.map(type => content[type]);
    stringifier.write([ 'Week commencing', ...heading, 'Total' ]);
    let date = moment(res.locals.static.since, 'YYYY-MM-DD').startOf('week');
    const now = moment();

    while (date.isBefore(now)) {
      const isoDate = date.format('YYYY-MM-DD');
      const metricsByType = countBy(metricsByDate[isoDate], 'type');
      const row = types.map(type => metricsByType[type] || 0);
      stringifier.write([ isoDate, ...row, (metricsByDate[isoDate] || []).length ]);
      date = date.add(1, 'week');
    }

    stringifier.write([ 'Total', ...types.map(type => allMetricsByType[type] || 0) ]);

    stringifier.pipe(res);
    return stringifier.end();
  }
  next();
};
