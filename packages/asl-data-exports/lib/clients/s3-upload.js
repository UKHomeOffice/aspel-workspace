const { S3 } = require('@asl/service/clients');
const { Upload } = require('@aws-sdk/lib-storage');
const { PassThrough } = require('stream');

module.exports = settings => {
  const s3Client = S3({ s3: settings });

  return async ({ key, stream }) => {
    const body = new PassThrough();
    stream.pipe(body);

    const uploader = new Upload({
      client: s3Client,
      params: {
        Bucket: settings.bucket,
        Key: key,
        Body: body,
        ServerSideEncryption: settings.kms ? 'aws:kms' : undefined,
        SSEKMSKeyId: settings.kms
      }
    });
    return uploader.done();
  };
};
