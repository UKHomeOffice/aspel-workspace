const crypto = require('crypto');
const { Upload } = require('@aws-sdk/lib-storage');

module.exports = ({ Attachment, bucket, kms, s3 }) => async file => {
  const id = crypto.randomUUID();
  const token = crypto.randomBytes(64).toString('hex');

  const uploader = new Upload({
    client: s3,
    params: {
      Bucket: bucket,
      Key: id,
      Body: file.body,
      ServerSideEncryption: kms ? 'aws:kms' : undefined,
      SSEKMSKeyId: kms
    }
  });

  await uploader.done();
  await Attachment.query().insert({
    id,
    token,
    mimetype: file.mimetype,
    filename: file.filename
  });

  return { token };
};
