const { Client, Transport } = require('@elastic/elasticsearch');
const { request } = require('http');
const { sign } = require('aws4');

/**
 * Creates a custom AWS SigV4 Transport class
 * This is the ONLY supported extension point in ES v8
 */
function createAwsSigV4Transport(credentials) {
  return class AwsSigV4Transport extends Transport {
    request(params, options, callback) {
      const signed = sign(
        {
          host: params.hostname,
          path: params.path,
          method: params.method,
          headers: params.headers,
          body: params.body,
          service: 'es',
          region: credentials.region
        },
        {
          accessKeyId: credentials.key,
          secretAccessKey: credentials.secret
        }
      );

      const req = request(signed, (res) => {
        callback(null, {
          statusCode: res.statusCode,
          headers: res.headers,
          body: res
        });
      });

      if (params.body) req.write(params.body);
      req.end();
    }
  };
}

/**
 * Main ES client factory
 */
const createESClient = async (options) => {
  if (options.aws?.credentials?.key) {
    console.log('creating AWS client');

    const credentials = {
      key: options.aws.credentials.key,
      secret: options.aws.credentials.secret,
      region: options.aws.region
    };

    const AwsTransport = createAwsSigV4Transport(credentials);

    return new Client({
      ...options.aws.client,
      Transport: AwsTransport
    });
  }

  console.log('no AWS vars set, creating local client');
  return new Client(options.local.client);
};

module.exports = {
  createESClient
};
