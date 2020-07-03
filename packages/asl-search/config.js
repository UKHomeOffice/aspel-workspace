module.exports = {
  port: process.env.PORT || 8080,
  verboseErrors: process.env.VERBOSE_ERRORS === 'true',

  es: {
    aws: {
      region: process.env.AWS_REGION || 'eu-west-2',
      credentials: {
        key: process.env.AWS_ES_KEY,
        secret: process.env.AWS_ES_SECRET
      },
      client: {
        node: process.env.AWS_ES_ENDPOINT,
        maxRetries: 3,
        requestTimeout: 10000
      }
    },
    local: {
      client: {
        node: process.env.ELASTIC_NODE || 'http://localhost:9200',
        maxRetries: 3,
        requestTimeout: 10000
      }
    }
  },

  auth: {
    realm: process.env.KEYCLOAK_REALM,
    url: process.env.KEYCLOAK_URL,
    client: process.env.KEYCLOAK_CLIENT,
    secret: process.env.KEYCLOAK_SECRET
  },

  db: {
    database: process.env.DATABASE_NAME || 'asl',
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD || 'test-password',
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USERNAME || 'postgres',
    application_name: 'search'
  }

};
