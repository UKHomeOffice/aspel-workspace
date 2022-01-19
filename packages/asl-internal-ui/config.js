module.exports = {
  log: {
    level: process.env.LOG_LEVEL || 'info'
  },
  port: process.env.PORT || 8080,
  api: process.env.API_URL,
  metrics: process.env.METRICS_URL,
  session: {
    secret: process.env.SESSION_SECRET,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  },
  auth: {
    realm: process.env.KEYCLOAK_REALM,
    url: process.env.KEYCLOAK_URL,
    client: process.env.KEYCLOAK_CLIENT,
    secret: process.env.KEYCLOAK_SECRET,
    profile: process.env.API_URL,
    permissions: process.env.PERMISSIONS_SERVICE
  },
  s3: {
    region: process.env.S3_REGION,
    accessKey: process.env.S3_ACCESS_KEY,
    secret: process.env.S3_SECRET,
    bucket: process.env.S3_BUCKET,
    localstackUrl: process.env.S3_LOCALSTACK_URL
  },
  errorEvent: 'asl.error',
  verboseErrors: process.env.VERBOSE_ERRORS === 'TRUE',
  pdfService: process.env.PDF_SERVICE,
  bodySizeLimit: process.env.BODY_SIZE_LIMIT
};
