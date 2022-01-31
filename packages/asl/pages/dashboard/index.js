const moment = require('moment');
const { cloneDeep } = require('lodash');
const { page } = require('@asl/service/ui');
const { dateFormat } = require('@asl/pages/constants');
const taskList = require('@asl/pages/pages/task/list/router');

function getAlertUrl(alert, req) {
  switch (alert.type) {
    case 'pilReview':
      return req.buildRoute('pil.read', {
        establishmentId: alert.model.establishmentId,
        profileId: alert.model.profileId,
        pilId: alert.model.id
      });

    case 'raDue':
      return req.buildRoute('project.read', {
        establishmentId: alert.model.establishmentId,
        projectId: alert.model.id
      });

    case 'ropDue':
      return req.buildRoute('project.read', {
        establishmentId: alert.model.establishmentId,
        projectId: alert.model.id
      });
  }
}

/**
 * Group alerts by establishment, type and status e.g.
 * [
 *   {
 *     id,
 *     name,
 *     summary: {
 *       pilReview: { due: 0, overdue: 0 },
 *       raDue: { due: 0, overdue: 0 },
 *       ropDue: { due: 0, overdue: 0 }
 *     }
 *   },
 *   ...
 * ]
 */
const summariseEstablishmentAlerts = (alerts = [], profileEstablishments = []) => {
  const summary = {
    pilReview: { due: 0, overdue: 0 },
    raDue: { due: 0, overdue: 0 },
    ropDue: { due: 0, overdue: 0 }
  };

  return alerts.reduce((result, alert) => {
    let idx = result.findIndex(e => e.id === alert.establishmentId);

    const establishment = idx !== -1
      ? result[idx]
      : {
        id: alert.establishmentId,
        name: (profileEstablishments.find(e => e.id === alert.establishmentId) || {}).name,
        summary: cloneDeep(summary)
      };

    if (alert.overdue) {
      establishment.summary[alert.type].overdue++;
    } else {
      establishment.summary[alert.type].due++;
    }

    if (idx !== -1) {
      result[idx] = establishment;
    } else {
      result.push(establishment);
    }

    return result;
  }, []);
};

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
          deadline: moment(alert.deadline).format(dateFormat.short),
          url: getAlertUrl(alert, req)
        }));

        const establishments = summariseEstablishmentAlerts(data.establishments, req.user.profile.establishments);

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
