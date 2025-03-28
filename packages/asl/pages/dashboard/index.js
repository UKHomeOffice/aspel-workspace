const { groupBy } = require('lodash');
const { page } = require('@asl/service/ui');
const { dateFormat } = require('@asl/pages/constants');
const taskList = require('@asl/pages/pages/task/list/router');
const { formatDate } = require('@asl/pages/lib/utils');

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
  const grouped = groupBy(alerts, 'establishmentId');

  return Object.keys(grouped)
    .map(id => parseInt(id, 10))
    .map(establishmentId => {

      const urlParams = { establishmentId };
      const raQueryString = '?status=inactive-statuses&sort%5Bcolumn%5D=raDate&sort%5Bascending%5D=true&page=1';
      const establishmentAlerts = grouped[establishmentId];
      const establishment = profileEstablishments.find(e => e.id === establishmentId) || {};

      // get the earliest year for any ROPs alert
      const year = establishmentAlerts
        .filter(alert => alert.type === 'ropDue')
        .map(alert => alert.ropsYear)
        .reduce((first, year) => Math.min(year, first), (new Date()).getFullYear());

      const details = {
        id: establishmentId,
        name: establishment.name,
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
            // if there are only overdue rops for a single year then go direct to that year
            url: buildRoute('establishment.rops.overview', { ...urlParams, year })
          }
        }
      };

      establishmentAlerts.forEach(alert => {
        if (alert.overdue) {
          details.summary[alert.type].overdue++;
        } else {
          details.summary[alert.type].due++;
        }
      });

      return details;

    });
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
