const { page } = require('@asl/service/ui');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname,
    paths: [
      '/revoke'
    ]
  });

  app.use((req, res, next) => {
    next();
  });

  return app;
};
