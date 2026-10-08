const { Router } = require('express');
const { S3 } = require('@asl/service/clients');
const { NotFoundError } = require('@asl/service/errors');
const { GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const validateUpload = require('../upload-validation');
const createUploadAttachment = require('../upload-attachment');

const { UploadValidationError } = validateUpload;

module.exports = settings => {

  const router = new Router();
  const s3 = S3(settings);
  const { Attachment } = settings.models;
  const uploadAttachment = createUploadAttachment({
    Attachment,
    bucket: settings.s3.bucket,
    kms: settings.s3.kms,
    s3
  });

  router.post('/', async (req, res, next) => {
    try {
      const response = await uploadAttachment(req);

      return res.status(200).json(response);
    } catch (e) {
      if (e instanceof UploadValidationError) {
        return res.status(e.status).json({ error: e.code });
      }
      next(e);
    }

  });

  router.get('/:token', async (req, res, next) => {
    try {
      const attachment = await Attachment.query().findOne({ token: req.params.token });

      if (!attachment) {
        return next(new NotFoundError());
      }

      const command = new GetObjectCommand({
        Bucket: settings.s3.bucket,
        Key: attachment.id
      });

      const result = await s3.send(command);

      const stream = result.Body;
      stream.on('error', e => {
        if (e.code === 'NoSuchKey') {
          return next(new NotFoundError());
        }
        return next(e);
      });
      res.set('X-Content-Type-Options', 'nosniff');
      res.set('x-original-filename', attachment.filename);
      res.set('Content-Type', attachment.mimetype);
      stream.pipe(res);
    } catch (e) {
      return next(e);
    }
  });

  router.delete('/:token', async (req, res, next) => {
    const { token } = req.params;

    try {
      const attachment = await Attachment.query().findOne({ token });
      if (!attachment) {
        return next(new NotFoundError());
      }

      await s3.send(new DeleteObjectCommand({
        Bucket: settings.s3.bucket,
        Key: attachment.id
      }));

      await Attachment.query().deleteById(attachment.id);

      return res.sendStatus(204);
    } catch (e) {
      return next(e);
    }
  });

  router.get('/attachment-id/:token', async (req, res, next) => {
    const { token } = req.params;

    try {
      const attachment = await Attachment.query().findOne({ token });

      if (!attachment) {
        return next(new NotFoundError());
      }
      return res.status(200).json({ id: attachment.id, uploadedAt: attachment.createdAt });
    } catch (e) {
      return next(e);
    }
  });

  return router;
};
