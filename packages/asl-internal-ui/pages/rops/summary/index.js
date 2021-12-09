const { page } = require('@asl/service/ui');
const { redirectOnPost } = require('@asl/pages/pages/establishment/rops/middleware');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(redirectOnPost({ target: 'ropsReporting.summary' }));

  return app;
};
