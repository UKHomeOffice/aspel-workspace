const { page } = require('@asl/service/ui');
const update = require('../routers/update');
const confirm = require('./routers/confirm');
const { setPageTitle } = require('../../../../common/middleware');

module.exports = () => {
  const app = page({
    root: __dirname,
    paths: ['/confirm']
  });

  app.all(['/', '/confirm'], setPageTitle());

  app.use(update());

  app.post('/', (req, res, next) => {
    res.redirect(`${req.buildRoute('pils.courses.update')}/confirm`);
  });

  app.use('/confirm', confirm());

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
