const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

module.exports = settings => {
  const configParams = {
    region: settings.region,
    accessKeyId: settings.accessKey,
    secretAccessKey: settings.secret
  };
  const isLocal = settings.url?.includes('localhost') || settings.url?.includes('localstack');
  if (isLocal) {
    configParams.endpoint = new URL(settings.url).origin;
    configParams.sslEnabled = false;
  }

  // Create SQS client using AWS SDK v3
  const sqs = new SQSClient(configParams);

  return async key => {
    const params = {
      QueueUrl: settings.url,
      MessageBody: JSON.stringify({ key })
    };

    try {
      return await sqs.send(new SendMessageCommand(params));
    } catch (err) {
      console.log(`Error Sending message to SQS queue: ${err}`);
      throw err;
    }
  };
};
