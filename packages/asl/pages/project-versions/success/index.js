const page = require('@asl/service/ui/page');
const success = require('@asl/pages/pages/common/routers/success');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(success());

  return app;
};
