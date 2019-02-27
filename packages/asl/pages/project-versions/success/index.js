const page = require('@asl/service/ui/page');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  return app;
};
