const moment = require('moment');
const { cloneDeep } = require('lodash');
const { page } = require('@asl/service/ui');
const { dateFormat } = require('@asl/pages/constants');
const taskList = require('@asl/pages/pages/task/list/router');

function getAlertUrl(alert, buildRoute) {
  switch (alert.type) {
    case 'pilReview':
      return buildRoute('pil.read', {
        establishmentId: alert.model.establishmentId,
        profileId: alert.model.profileId,
        pilId: alert.model.id
      });

    case 'raDue':
      return buildRoute('project.read', {
        establishmentId: alert.model.establishmentId,
        projectId: alert.model.id
      });

    case 'ropDue':
      return buildRoute('project.read', {
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
const summariseEstablishmentAlerts = (alerts = [], profileEstablishments = [], buildRoute) => {
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
      establishment.summary['pilReview'].url = buildRoute('pils', { establishmentId: alert.establishmentId });
      const raUrlParams = '?status=inactive-statuses&sort%5Bcolumn%5D=raDate&sort%5Bascending%5D=true&page=1';
      establishment.summary['raDue'].url = buildRoute('project', { establishmentId: alert.establishmentId, suffix: raUrlParams });
      establishment.summary['ropDue'].url = buildRoute('establishment.rops', { establishmentId: alert.establishmentId });
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
