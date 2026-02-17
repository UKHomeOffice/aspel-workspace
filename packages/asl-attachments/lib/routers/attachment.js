const { Router } = require('express');
const Busboy = require('busboy');
const crypto = require('crypto');
const { v4: uuid } = require('uuid');
const sharp = require('sharp');

const { S3 } = require('@asl/service/clients');
const { NotFoundError } = require('@asl/service/errors');
const { Upload } = require('@aws-sdk/lib-storage');
const { GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

module.exports = settings => {

  const router = new Router();
  const s3 = S3(settings);
  const { Attachment } = settings.models;

  router.post('/', async (req, res, next) => {
    const busboy = Busboy({ headers: req.headers, filesLimit: 1 });
    const id = uuid();
    const token = crypto.randomBytes(64).toString('hex');
    const transform = sharp().resize(1200, undefined, { withoutEnlargement: true });
    try {
      const file = await new Promise((resolve, reject) => {
        busboy.on('file', (field, stream, file) => {
          let bodyStream = stream;
          if (file.mimeType.match(/^image\//)) {
            bodyStream = stream.pipe(transform);
          }
          const uploader = new Upload({
            client: s3,
            params: {
              Bucket: settings.s3.bucket,
              Key: id,
              Body: bodyStream,
              ServerSideEncryption: settings.s3.kms ? 'aws:kms' : undefined,
              SSEKMSKeyId: settings.s3.kms
            }
          });

          uploader.done()
            .then(() => resolve(file))
            .catch(reject);
        });
        req.pipe(busboy);
      });

      await Attachment.query().insert({ id, token, mimetype: file.mimeType, filename: file.filename });

      return res.status(200).json({ token });
    } catch (e) {
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

      // result.Body is a Node.js Readable stream
      const stream = result.Body;
      stream.on('error', e => {
        if (e.code === 'NoSuchKey') {
          return next(new NotFoundError());
        }
        next(e);
      });
      res.set('x-original-filename', attachment.filename);
      res.set('Content-Type', attachment.mimetype);
      stream.pipe(res);
    } catch (e) {
      next(e);
    }
  });

  router.delete('/:token', async (req, res, next) => {
    const { token } = req.params;

    try {
      // Find the attachment by token
      const attachment = await Attachment.query().findOne({ token });
      if (!attachment) {
        return next(new NotFoundError());
      }

      // Delete from S3
      await s3.send(new DeleteObjectCommand({
        Bucket: settings.s3.bucket,
        Key: attachment.id
      }));

      // Delete from DB
      await Attachment.query().deleteById(attachment.id);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
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
      next(e);
    }
  });

  return router;
};
