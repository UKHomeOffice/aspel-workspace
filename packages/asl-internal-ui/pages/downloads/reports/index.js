const { Router } = require('express');
const csv = require('csv-stringify');

module.exports = settings => {
  const router = Router({ mergeParams: true });

  router.get('/', (req, res, next) => {
    const report = req.params.report;
    req.api(`/reports/${report}`)
      .then(result => {
        const stringifier = csv({ header: true });
        res.attachment(`${report}.csv`);

        result.json.data.forEach(row => stringifier.write(row));

        stringifier.pipe(res);
        return stringifier.end();
      })
      .catch(next);
  });

  return router;
};
