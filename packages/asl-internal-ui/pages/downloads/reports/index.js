const { Router } = require('express');
const csv = require('csv-stringify');
const conditionsReportMapper = require('./conditions-report-mapper');

const process = report => data => {
  if (report === 'ppl-conditions') {
    return conditionsReportMapper(data);
  }
  return data;
};

module.exports = settings => {
  const router = Router({ mergeParams: true });

  router.get('/', (req, res, next) => {
    const report = req.params.report;
    req.api(`/reports/${report}`)
      .then(result => result.json.data)
      .then(process(report))
      .then(data => {
        res.attachment(`${report}.csv`);
        const stringifier = csv({ header: true });
        data.forEach(row => stringifier.write(row));
        stringifier.pipe(res);
        return stringifier.end();
      })
      .catch(next);
  });

  return router;
};
