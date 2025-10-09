module.exports = {
  port: process.env.PORT || 8080,
  api: process.env.API_URL,
  attachments: process.env.ATTACHMENTS_SERVICE,
  jwt: process.env.JWT_SECRET,
  internalUrl: process.env.INTERNAL_URL,
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
  errorEvent: 'asl.error',
  verboseErrors: process.env.VERBOSE_ERRORS === 'TRUE',
  pdfService: process.env.PDF_SERVICE,
  bodySizeLimit: process.env.BODY_SIZE_LIMIT,
  forwardApi: process.env.ENABLE_API_FORWARDING === 'TRUE'
};
