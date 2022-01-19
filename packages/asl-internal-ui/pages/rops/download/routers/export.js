const { Router } = require('express');
const filenamify = require('filenamify');
const { S3 } = require('@asl/service');

module.exports = settings => {
  const router = Router({ mergeParams: true });
  const s3Client = S3(settings);

  router.get('/', (req, res, next) => {
    req.api(`/rops/${req.year}/export/${req.params.exportId}`)
      .then(response => {
        const { id, updatedAt, meta: { etag } } = response.json.data;
        res.attachment(filenamify(`${req.year}-rops-${updatedAt}.zip`));

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
