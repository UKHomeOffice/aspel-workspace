const { Client } = require('@elastic/elasticsearch');
const { Connection } = require('@elastic/elasticsearch');
const { request } = require('http');
const { sign } = require('aws4');

/**
 * Replacement for createAWSConnection (acuris)
 * Implements AWS SigV4 signing using explicit credentials
 */
const createESConnection = (credentials) =>
  class AWSConnection extends Connection {
    constructor(opts) {
      super(opts);

      this.makeRequest = (reqParams) => {
        const signed = sign(
          {
            ...reqParams,
            service: 'es',
            region: credentials.region
          },
          {
            accessKeyId: credentials.key,
            secretAccessKey: credentials.secret
          }
        );

        return request(signed);
      };
    }
  };

const createESClient = async (options) => {
  if (options.aws?.credentials?.key) {
    const credentials = {
      key: options.aws.credentials.key,
      secret: options.aws.credentials.secret,
      region: options.aws.region
    };

    return new Client({
      ...options.aws.client,
      Connection: createESConnection(credentials)
    });
  }

  console.log('no AWS vars set, creating local client');
  return new Client(options.local.client);
};

module.exports = {
  createESClient
};
