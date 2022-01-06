const moment = require('moment');
const csv = require('csv-stringify');
const { page } = require('@asl/service/ui');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  const reports = () => {
    const earliest = moment('2021-12-01');
    const latest = moment().startOf('month');
    const months = [];
    let date = earliest;

    // eslint-disable-next-line no-unmodified-loop-condition
    while (date < latest) {
      months.unshift({ year: date.format('YYYY'), month: date.format('MMMM'), path: `/${date.format('YYYY/MM')}` });
      date.add(1, 'month');
    }

    return months;
  };

  app.get('/', (req, res, next) => {
    res.locals.static.reports = reports();
    next();
  });

  app.get('/:year/:month', (req, res, next) => {
    const query = req.params;

    res.attachment('task-targets.csv');
    const stringifier = csv({ bom: true, header: true });

    return req.api('/reports/task-metrics', { query })
      .then(response => {
        const data = response.json.data;
        if (data.length > 0) {
          data.forEach(row => stringifier.write(row));
        } else {
          stringifier.write({ note: 'no tasks exceeded their internal targets this month' });
        }
        stringifier.pipe(res);
        return stringifier.end();
      })
      .catch(next);
  });

  return app;
};
