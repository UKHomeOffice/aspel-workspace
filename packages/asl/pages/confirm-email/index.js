const { page } = require('@asl/service/ui');
const routes = require('./routes');
const resend = require('./resend');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    res.locals.static.profile = req.user.profile;
    next();
  });

  app.use(resend(settings));

  app.get('/', (req, res, next) => {
    if (req.user.profile.emailConfirmed) {
      return res.redirect(req.buildRoute('dashboard'));
    }
    next();
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};

module.exports.routes = routes;
