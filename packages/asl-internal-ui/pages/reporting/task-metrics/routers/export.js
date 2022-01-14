const { Router } = require('express');
const AWS = require('aws-sdk');
const filenamify = require('filenamify');

module.exports = settings => {
  const app = Router({ mergeParams: true });

  const S3 = new AWS.S3({
    apiVersion: '2006-03-01',
    region: settings.s3.region,
    accessKeyId: settings.s3.accessKey,
    secretAccessKey: settings.s3.secret
  });

  app.get('/', (req, res, next) => {
    req.api(`/reports/task-metrics/${req.params.exportId}`)
      .then(response => {
        const { id, meta: { start, end, etag } } = response.json.data;

        res.attachment(filenamify(`task-metrics_${start}_${end}.zip`));
        S3.getObject({
          Bucket: settings.s3.bucket,
          Key: id,
          IfMatch: etag
        }).createReadStream().pipe(res);
      })
      .catch(next);
  });

  return app;
};
