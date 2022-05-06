const { page } = require('@asl/service/ui');
const datatable = require('@asl/pages/pages/common/routers/datatable');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    next();
  });

  app.use(datatable({
    configure: (req, res, next) => {
      next();
    },
    locals: (req, res, next) => {
      next();
    }
  })({ schema, apiPath: '/enforcement', defaultRowCount: 5 }));

  return app;
};
