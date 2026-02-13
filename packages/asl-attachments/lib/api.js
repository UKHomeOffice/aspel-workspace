const api = require('@asl/service/api');
const db = require('@asl/schema');
const { S3 } = require('@asl/service/clients');
const errorHandler = require('@asl/service/lib/error-handler');
const { HeadBucketCommand } = require('@aws-sdk/client-s3');

const attachment = require('./routers/attachment');

module.exports = settings => {

  const s3 = S3(settings);

  settings.healthcheck = () => {
    return s3.send(
      new HeadBucketCommand({ Bucket: settings.s3.bucket })
    );
  };

  const app = api(settings);
  const models = db(settings.db);

  app.db = models;

  settings.models = models;

  app.use(attachment(settings));

  app.use(errorHandler(settings));

  return app;

};
