const { page } = require('@asl/service/ui');
const { dateFormat } = require('@asl/pages/constants');
const taskList = require('@asl/pages/pages/task/list/router');
const { formatDate } = require('@asl/pages/lib/utils');
const { getAlertUrl, summariseEstablishmentAlerts } = require('./helpers');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res, next) => {
    res.locals.static.profile = req.user.profile;
    next();
  });

  app.get('/', (req, res, next) => {
    req.api('/me/alerts')
      .then(response => response.json.data)
      .then(data => {
        const personal = (data.personal || []).map(alert => ({
          ...alert,
          deadline: formatDate(alert.deadline, dateFormat.short),
          url: getAlertUrl(alert, req.buildRoute)
        }));

        const establishments = summariseEstablishmentAlerts(data.establishments, req.user.profile.establishments, req.buildRoute);

        res.locals.static.alerts = { personal, establishments };
      })
      .then(() => next())
      .catch(err => {
        req.log('error', { message: err.message, stack: err.stack, ...err });
        // don't block dashboard rendering for failed alerts
        next();
      });
  });

  app.get('/', taskList());

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
