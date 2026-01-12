const { S3Client } = require('@aws-sdk/client-s3');

module.exports = (settings) => {
  const config = {
    region: settings.s3.region,
    credentials: {
      accessKeyId: settings.s3.accessKey,
      secretAccessKey: settings.s3.secret
    }
  };

  if (settings.s3.localstackUrl) {
    // force the client to use path based URLs instead of subdomains, e.g. http://localhost/bucket instead of http://bucket.localhost
    config.forcePathStyle = true;
    config.endpoint = settings.s3.localstackUrl;
  }

  return new S3Client(config);
};
