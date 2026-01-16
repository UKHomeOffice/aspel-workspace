const { fromStatic } = require('@aws-sdk/credential-providers');
const { Client } = require('@elastic/elasticsearch');
const { createAWSConnection, awsGetCredentials } = require('@acuris/aws-es-connection');

const createESClient = async (options) => {
  if (options.aws.credentials.key) {
    console.log('creating AWS client');

    const credentials = fromStatic({
      accessKeyId: options.aws.credentials.key,
      secretAccessKey: options.aws.credentials.secret
    });

    const awsCredentials = await awsGetCredentials({ credentials, region: options.aws.region });
    const AWSConnection = createAWSConnection(awsCredentials);

    return new Client({
      ...options.aws.client,
      ...AWSConnection
    });
  }

  console.log('no AWS vars set, creating local client');
  return new Client(options.local.client);
};

module.exports = {
  createESClient
};
