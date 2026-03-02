const { Client } = require('@elastic/elasticsearch');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { Sha256 } = require('@aws-crypto/sha256-js');
const { HttpRequest } = require('@aws-sdk/protocol-http');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const { URL } = require('url');

class AwsSigV4Connection {
  constructor(opts) {
    this.url = opts.url;
    this.signer = opts.signer;
  }

  async request(params, callback) {
    console.log(params);
    try {
      const request = new HttpRequest({
        method: params.method,
        headers: params.headers,
        hostname: this.url.hostname,
        path: params.path,
        query: params.query,
        body: params.body,
        protocol: this.url.protocol,
        port: this.url.port
      });

      const signed = await this.signer.sign(request);
      const handler = new NodeHttpHandler();
      const { response } = await handler.handle(signed);

      let body = '';
      for await (const chunk of response.body) {
        body += chunk;
      }

      callback(null, {
        statusCode: response.statusCode,
        headers: response.headers,
        body,
      });
    } catch (err) {
      callback(err);
    }
  }
}

const createESClient = (options) => {
  if (options.aws?.credentials?.key) {
    console.log('creating AWS client');

    const region = options.aws.region;
    const credentials = {
      accessKeyId: options.aws.credentials.key,
      secretAccessKey: options.aws.credentials.secret
    };

    const signer = new SignatureV4({
      service: 'es',
      region,
      credentials,
      sha256: Sha256
    });

    const node = new URL(options.aws.client.node);

    return new Client({
      ...options.aws.client,
      Connection: AwsSigV4Connection,
      ConnectionParams: {
        url: node,
        signer
      }
    });
  }

  console.log('no AWS vars set, creating local client');
  return new Client(options.local.client);
};

module.exports = { createESClient };
