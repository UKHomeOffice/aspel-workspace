const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

module.exports = settings => {
  const sqs = new SQSClient({
    region: settings.region,
    credentials: {
      accessKeyId: settings.accessKey,
      secretAccessKey: settings.secret
    }
  });

  return async key => {
    const params = {
      QueueUrl: settings.url,
      MessageBody: JSON.stringify({ key })
    };

    try {
      return await sqs.send(new SendMessageCommand(params));
    } catch (err) {
      throw err;
    }
  };
};
