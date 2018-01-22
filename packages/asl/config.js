module.exports = {
  secret: process.env.SESSION_SECRET,
  port: process.env.PORT || 8080,
  session: {
    secret: process.env.SESSION_SECRET,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  auth: {
    realm: process.env.KEYCLOAK_REALM,
    url: process.env.KEYCLOAK_URL,
    client: process.env.KEYCLOAK_CLIENT,
    secret: process.env.KEYCLOAK_SECRET
  }
};
