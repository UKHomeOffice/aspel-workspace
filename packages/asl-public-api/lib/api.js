const api = require('@asl/service/api');
const db = require('@asl/schema');
const { NotFoundError } = require('./errors');
const errorHandler = require('./error-handler');
const userRouter = require('./routers/user');
const establishmentRouter = require('./routers/establishment');
const proxy = require('./middleware/proxy');
const { createRedisStore, createPasswordAttemptLimiter } = require('./middleware/password-attempt-limit');
const createEmailChangeProof = require('./middleware/email-change-proof');
const OpenApiValidator = require('express-openapi-validator');

module.exports = settings => {

  const app = api(settings);
  const models = db(settings.db);
  const passwordAttemptLimit = settings.passwordAttemptLimit || {};
  const passwordAttemptStore = passwordAttemptLimit.store ||
    (passwordAttemptLimit.redisHost ? createRedisStore(passwordAttemptLimit) : null);
  const routerSettings = {
    ...settings,
    emailChangeProof: createEmailChangeProof(passwordAttemptStore),
    passwordAttemptLimiter: createPasswordAttemptLimiter({
      store: passwordAttemptStore,
      maxAttempts: passwordAttemptLimit.maxAttempts,
      windowMs: passwordAttemptLimit.windowMs
    })
  };

  app.db = models;
  app.passwordAttemptStore = passwordAttemptStore;

  app.use((req, res, next) => {
    req.models = models;
    next();
  });

  app.use((req, res, next) => {
    res.meta = {};
    next();
  });

  app.use(
    OpenApiValidator.middleware({
      apiSpec: settings.openApi.openApiSpec,
      validateRequests: true, // Validate request bodies, params, etc.
      validateResponses: false, // Optional: validate responses
      ignoreUndocumented: true
    })
  );

  // tell res.json() to strip any carriage returns from the response data
  app.set('json replacer', (key, value) => {
    if (typeof value === 'string') {
      return value.replace(/\r/g, '');
    }
    return value;
  });

  app.use(require('./middleware/user'));
  app.use(require('./middleware/permissions-bypass'));
  app.use(require('./middleware/send-response'));

  app.use('/search', proxy(`${settings.search}`));

  app.use('/me', userRouter(routerSettings));
  app.use('/asru-profile', require('./routers/asru-profile'));
  app.use('/invitation', require('./routers/invitation'));
  app.use('/establishment(s)?', establishmentRouter(routerSettings));
  app.use('/task(s)?', require('./routers/task'));

  app.use((req, res) => res.sendResponse());

  app.use((req, res, next) => {
    next(new NotFoundError());
  });

  app.use(errorHandler());

  return app;

};
