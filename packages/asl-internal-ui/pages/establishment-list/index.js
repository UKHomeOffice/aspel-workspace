const page = require('@asl/pages/lib/page');
const datatable = require('@asl/pages/pages/common/routers/datatable');

const schema = require('./schema');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', datatable()({
    apiPath: '/establishments',
    schema
  }));

  app.get('/', (req, res) => {
    res.sendResponse();
  });

  return app;
};
