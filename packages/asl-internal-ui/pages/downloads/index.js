const { page } = require('@asl/service/ui');
const routes = require('./routes');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};

module.exports.routes = routes;
