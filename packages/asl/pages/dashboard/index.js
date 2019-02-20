const { page } = require('@asl/service/ui');
const taskList = require('@asl/pages/pages/task/list/router');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res, next) => {
    res.locals.static.profile = req.user.profile;
    res.locals.static.isUser = req.user.profile.id === req.profileId;
    next();
  });

  app.get('/', taskList());

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
