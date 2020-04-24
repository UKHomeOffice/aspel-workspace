module.exports = {
  port: process.env.PORT || 8080,
  whitelist: (process.env.DOMAIN_WHITELIST || '').split(',').filter(Boolean),
  email: {
    apiKey: process.env.EMAILER_API_KEY,
    template: process.env.EMAILER_TEMPLATE_KEY
  }
};
