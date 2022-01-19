const { Router } = require('express');
const filenamify = require('filenamify');
const s3Middleware = require('../../../../lib/middleware/s-three');

module.exports = settings => {
  const router = Router({ mergeParams: true });

  router.use(s3Middleware(settings));

  router.get('/', (req, res, next) => {
    req.api(`/reports/task-metrics/${req.params.exportId}`)
      .then(response => {
        const { id, meta: { start, end, etag } } = response.json.data;
        res.attachment(filenamify(`task-metrics_${start}_${end}.zip`));
        return req.s3(id, etag).pipe(res);
      })
      .catch(next);
  });

  return router;
};
