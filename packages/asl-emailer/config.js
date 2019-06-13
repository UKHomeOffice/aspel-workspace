module.exports = {
  port: process.env.PORT || 8080,
  whitelist: (process.env.DOMAIN_WHITELIST || '').split(','),
  email: {
    from: process.env.EMAIL_FROM_ADDRESS,
    key: process.env.EMAIL_ACCESS_KEY,
    secret: process.env.EMAIL_SECRET,
    region: process.env.EMAIL_REGION
  }
};
