const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const { fromStatic } = require('@aws-sdk/credential-providers');

module.exports = (settings) => {
  const sqsClient = new SQSClient({
    region: settings.region,
    credentials: fromStatic({
      accessKeyId: settings.accessKey,
      secretAccessKey: settings.secret
    })
  });

  return async (key) => {
    const params = {
      QueueUrl: settings.url,
      MessageBody: JSON.stringify({ key })
    };

    try {
      const command = new SendMessageCommand(params);
      return await sqsClient.send(command);
    } catch (err) {
      throw err;
    }
  };
};
