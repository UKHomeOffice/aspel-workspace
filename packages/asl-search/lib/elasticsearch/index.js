const { Client, Connection } = require('@elastic/elasticsearch');
const aws4 = require('aws4');

const createESClient = async (options) => {
  if (options.aws.credentials.key) {
    console.log('creating AWS client');

    const awsCredentials = {
      accessKeyId: options.aws.credentials.key,
      secretAccessKey: options.aws.credentials.secret,
    };

    class AwsConnection extends Connection {
      request(params, callback) {
        const path = params.querystring ? `${params.path}?${params.querystring}` : params.path;
        const url = new URL(this.url.href);

        const opts = {
          method: params.method,
          path: path,
          body: params.body,
          headers: {
            ...params.headers,
            'host': url.host
          },
          service: 'es',
          region: options.aws.region,
          hostname: url.hostname,
        };

        aws4.sign(opts, awsCredentials);
        params.headers = opts.headers;
        return super.request(params, callback);
      }
    }

    return new Client({
      ...options.aws.client,
      Connection: AwsConnection
    });
  }

  console.log('no AWS vars set, creating local client');
  return new Client(options.local.client);
};

module.exports = {
  createESClient
};
