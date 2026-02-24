const { performance } = require('perf_hooks');
const { mapValues, pick } = require('lodash');
const db = require('@asl/schema');
const StatsD = require('hot-shots');

const JWT = require('./jwt');
const Emailer = require('./emailer');
const Resolvers = require('./resolvers');
const Changelog = require('./changelog');
const S3 = require('./s3');
const Keycloak = require('./keycloak');

module.exports = settings => {

  const logger = settings.logger;
  const statsd = new StatsD();

  const models = db(settings.db);
  const jwt = JWT(settings.jwt);
  const emailer = Emailer(settings.emailer, logger);
  const getMessage = S3(settings.s3, logger);
  const keycloak = Keycloak(settings.auth);

  const resolvers = mapValues(Resolvers, resolver => resolver({ models, jwt, emailer, keycloak, logger }));

  const changelog = Changelog(models.Changelog);

  return async (message) => {
    const start = performance.now();
    let body;

    try {
      // --- parse message ---
      const data = JSON.parse(message.Body);

      // --- fetch from S3 ---
      body = await getMessage(data.key);

      if (!body) {
        // Already processed / NoSuchKey
        logger.warn(`Skipping processing for key ${data.key} — already processed`);
        return message;
      }

      message.body = pick(body, 'model', 'action', 'id', 'changedBy');

      if (!body.model || !resolvers[body.model]) {
        throw new Error(`Unknown model type: ${body.model}`);
      }

      logger.info('Received message', message.body);

      const resolver = resolvers[body.model];

      // --- transactional resolver execution ---
      const transaction = await models.transaction();
      try {
        const changes = await resolver(body, transaction);
        await changelog.log(message.MessageId, body, changes, transaction);
        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
        throw err;
      }

      // --- StatsD metrics ---
      statsd.increment('asl-resolver.error', 0); // zero-error
      const time = performance.now() - start;
      statsd.timing('asl-resolver.processTime', time);
      statsd.increment('asl-resolver.processed', 1);

      logger.info('Processed message', { ...message.body, time });
      return message;

    } catch (err) {
      try {
        // --- log and track error ---
        const errData = {
          ...err,
          message: err.message,
          stack: err.stack,
          ...(message.body || {})
        };
        logger.error(errData);
        statsd.increment('asl-resolver.error');

        await changelog.logError(message.MessageId, message.body || {}, errData);
      } catch (innerErr) {
        logger.error({
          ...innerErr,
          message: innerErr.message,
          stack: innerErr.stack
        });
      }
    }
  };
};
