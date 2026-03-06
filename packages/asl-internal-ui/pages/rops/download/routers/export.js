const { Router } = require('express');
const filenamify = require('filenamify');
const { S3 } = require('@asl/service/clients');
const { GetObjectCommand } = require('@aws-sdk/client-s3');

module.exports = settings => {
  const router = Router({ mergeParams: true });
  const s3Client = S3(settings);

  router.get('/', async (req, res, next) => {
    try {
      const response = await req.api(`/rops/${req.year}/export/${req.params.exportId}`);
      const { id, updatedAt, meta: { etag } } = response.json.data;

      res.attachment(filenamify(`${req.year}-rops-${updatedAt}.zip`));

      const command = new GetObjectCommand({
        Bucket: settings.s3.bucket,
        Key: id,
        IfMatch: etag
      });

      const s3Response = await s3Client.send(command);

      // Body is a stream in v3
      s3Response.Body.pipe(res);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
