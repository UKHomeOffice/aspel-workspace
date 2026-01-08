const { Consumer } = require('sqs-consumer');
const { SQSClient } = require('@aws-sdk/client-sqs');
const config = require('./config');

const Logger = require('./lib/utils/logger');

const logger = Logger(config);

const handleMessage = require('./lib/worker')({ ...config, logger });

const isLocal = config.sqs.endpoint.includes('localhost') || config.sqs.endpoint.includes('localstack');

// Create SQS client using AWS SDK v3
const sqsClient = new SQSClient({
  region: config.sqs.region,
  accessKeyId: config.sqs.accessKey,
  secretAccessKey: config.sqs.secret,
  endpoint: config.sqs.endpoint,
  sslEnabled: !isLocal
});

// Initialize SQS consumer
const app = Consumer.create({
  queueUrl: config.sqs.url,
  handleMessage,
  batchSize: 10,
  sqs: sqsClient
});

app.on('error', error => {
  logger.error(error.message);
  app.stop();
  setTimeout(() => app.start(), 1000);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.on('timeout_error', (err) => {
  console.error(err.message);
});

app.start();

logger.info(`Listening to queue at ${config.sqs.url}`);
