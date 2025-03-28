const { Router } = require('express');
const filenamify = require('filenamify');
const { S3 } = require('@asl/service/clients');

module.exports = settings => {
  const router = Router({ mergeParams: true });
  const s3Client = S3(settings);

  router.get('/', (req, res, next) => {
    req.api(`/reports/task-metrics/${req.params.exportId}`)
      .then(response => {
        const { id, meta: { start, end, etag } } = response.json.data;
        res.attachment(filenamify(`task-metrics_${start}_${end}.zip`));

        return s3Client.getObject({
          Bucket: settings.s3.bucket,
          Key: id,
          IfMatch: etag
        }).createReadStream().pipe(res);
      })
      .catch(next);
  });

  return router;
};
