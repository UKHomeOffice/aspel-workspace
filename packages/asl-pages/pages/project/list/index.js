const { set } = require('lodash');
const { page } = require('@asl/service/ui');
const datatable = require('../../common/routers/datatable');
const schema = require('../schema');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(datatable({
    configure: (req, res, next) => {
      const status = req.query.status || 'active';

      switch (status) {
        case 'inactive':
          req.datatable.sort = { column: 'updatedAt', ascending: false };
          break;
        case 'inactive-statuses':
          req.datatable.sort = { column: 'title', ascending: true };
          break;
        default:
          req.datatable.sort = { column: 'expiryDate', ascending: true };
          break;
      }

      req.datatable.schema = schema(status);
      next();
    },
    locals: (req, res, next) => {
      const establishment = req.user.profile.establishments.find(e => e.id === req.establishmentId);
      set(res.locals, 'static.status', req.query.status || 'active');
      set(res.locals, 'static.isBasicUser', !!(establishment && establishment.role === 'basic'));
      set(res.locals, 'static.adminListUrl', req.buildRoute('profile.list', { suffix: '?filters[roles][0]=admin' }));
      next();
    },
    getApiPath: (req, res, next) => {
      const query = {
        status: req.query.status || 'active'
      };
      req.datatable.apiPath = [`/establishment/${req.establishmentId}/projects`, { query }];
      next();
    }
  })({ schema }));

  return app;
};
