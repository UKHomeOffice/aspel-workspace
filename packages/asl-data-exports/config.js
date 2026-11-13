module.exports = {
  logLevel: process.env.LOG_LEVEL || 'info',
  interval: parseInt(process.env.INTERVAL, 10),
  s3: {
    region: process.env.S3_REGION || 'eu-west-2',
    accessKey: process.env.S3_ACCESS_KEY || 'test',
    secret: process.env.S3_SECRET || 'test',
    bucket: process.env.S3_BUCKET || 'asl-dev',
    kms: process.env.S3_KMS_KEY_ID || 'arn:aws:kms:eu-west-2:123456789012:key/12345678-1234-1234-1234-123456789012',
    localstackUrl: process.env.S3_LOCALSTACK_URL || 'http://localhost:4566'
  },
  db: {
    database: process.env.DATABASE_NAME || 'asl',
    host: process.env.DATABASE_HOST || 'localhost',
    password: process.env.DATABASE_PASSWORD || 'test-password',
    port: process.env.DATABASE_PORT || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres'
  },
  auth: {
    realm: process.env.KEYCLOAK_REALM || 'asl-dev',
    url: process.env.KEYCLOAK_URL || 'https://acp-sso.notprod.acp.homeoffice.gov.uk',
    client: process.env.KEYCLOAK_CLIENT || 'asl-dev-connect',
    secret: process.env.KEYCLOAK_SECRET || 'e4dcde1f-ac66-4a29-8883-d349cc478a81',
    username: process.env.KEYCLOAK_USERNAME || 'data-exports',
    password: process.env.KEYCLOAK_PASSWORD || 'MGzSBWmnj4Da'
  },
  metrics: {
    url: process.env.METRICS_SERVICE || 'http://asl-metrics:8089'
  }
};
