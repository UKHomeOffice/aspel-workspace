const { page } = require('@asl/service/ui');
const update = require('./routers/update');
const confirm = require('./routers/confirm');
const { success } = require('@asl/pages/pages/common/routers');

module.exports = () => {
  const app = page({
    root: __dirname,
    paths: ['/confirm', '/success']
  });

  app.use((req, res, next) => {
    req.model = req.establishment;
    next();
  });

  app.use('/', update());
  app.use('/confirm', confirm());
  app.use('/success', success());

  return app;
};
