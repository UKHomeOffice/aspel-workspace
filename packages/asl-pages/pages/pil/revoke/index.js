const { page } = require('@asl/service/ui');
const update = require('./routers/update');
const confirm = require('./routers/confirm');
const success = require('../../success');
const { setPageTitle } = require('../../common/middleware');

module.exports = () => {
  const app = page({
    root: __dirname,
    paths: ['/confirm', '/success']
  });

  app.all(['/', '/confirm'], setPageTitle());

  app.use((req, res, next) => {
    req.model = req.pil;
    next();
  });

  app.use('/', update());
  app.use('/confirm', confirm());
  app.use('/success', success());

  return app;
};
