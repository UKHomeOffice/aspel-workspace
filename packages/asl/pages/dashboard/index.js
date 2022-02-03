const moment = require('moment');
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
        projectId: alert.model.id,
        suffix: '#reporting'
      });

    case 'ropDue':
      return buildRoute('project.read', {
        establishmentId: alert.model.establishmentId,
        projectId: alert.model.id,
        suffix: '#reporting'
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
  const establishments = alerts.reduce((result, alert) => {
    const raQueryString = '?status=inactive-statuses&sort%5Bcolumn%5D=raDate&sort%5Bascending%5D=true&page=1';
    const urlParams = { establishmentId: alert.establishmentId };

    const establishment = result[alert.establishmentId] || {
      id: alert.establishmentId,
      name: (profileEstablishments.find(e => e.id === alert.establishmentId) || {}).name,
      summary: {
        pilReview: {
          due: 0,
          overdue: 0,
          url: buildRoute('pils', urlParams)
        },
        raDue: {
          due: 0,
          overdue: 0,
          url: buildRoute('project', { ...urlParams, suffix: raQueryString })
        },
        ropDue: {
          due: 0,
          overdue: 0,
          url: buildRoute('establishment.rops', urlParams)
        }
      }
    };

    if (alert.overdue) {
      establishment.summary[alert.type].overdue++;
    } else {
      establishment.summary[alert.type].due++;
    }

    return { ...result, [establishment.id]: establishment };
  }, {});

  return Object.values(establishments);
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
