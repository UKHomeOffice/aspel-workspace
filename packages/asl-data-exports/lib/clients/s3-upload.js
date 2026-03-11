const { S3 } = require('@asl/service/clients');
const { Upload } = require('@aws-sdk/lib-storage');
const { Readable } = require('stream');

module.exports = settings => {
  const s3Client = S3({ s3: settings });

  const upload = async ({ key, stream }) => {
    const realStream = Readable.from(stream);
    const uploader = new Upload({
      client: s3Client,
      params: {
        Bucket: settings.bucket,
        Key: key,
        Body: realStream,
        ServerSideEncryption: settings.kms ? 'aws:kms' : undefined,
        SSEKMSKeyId: settings.kms
      }
    });
    return uploader.done();
  };
  return upload;
};
