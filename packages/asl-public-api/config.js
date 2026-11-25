const path = require('path');

const positiveInteger = (name, fallback) => {
  const value = process.env[name];
  if (value === undefined || value === '') {
    return fallback;
  }
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return Number(value);
};

module.exports = {
  port: process.env.PORT || 8080,
  workflow: process.env.WORKFLOW_SERVICE,
  search: process.env.SEARCH_SERVICE,
  auth: {
    realm: process.env.KEYCLOAK_REALM,
    url: process.env.KEYCLOAK_URL,
    client: process.env.KEYCLOAK_CLIENT,
    secret: process.env.KEYCLOAK_SECRET,
    permissions: process.env.PERMISSIONS_SERVICE,
    adminUsername: process.env.KEYCLOAK_USERNAME,
    adminPassword: process.env.KEYCLOAK_PASSWORD
  },
  passwordAttemptLimit: {
    redisHost: process.env.REDIS_HOST,
    redisPort: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    maxAttempts: positiveInteger('RL_VERIFY_MAX', 5),
    windowMs: positiveInteger('RL_VERIFY_WINDOW_MS', 15 * 60 * 1000)
  },
  db: {
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USERNAME,
    application_name: 'public-api',
    maxConnections: parseInt(process.env.DATABASE_POOL_SIZE, 10) || 5
  },
  bodySizeLimit: process.env.BODY_SIZE_LIMIT,
  openApi: {
    serveApiDocs: process.env.SERVE_API_DOCS === 'TRUE',
    openApiSpec: path.resolve(path.join(__dirname, 'openapi.json'))
  }
};
