const { set, pick, omit } = require('lodash');
const { page } = require('@asl/service/ui');
const datatable = require('@asl/pages/pages/common/routers/datatable');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    root: __dirname,
    ...settings
  });

  app.use((req, res, next) => {
    res.locals.pageTitle = 'Staff directory';
    next();
  });

  app.use(datatable({
    configure: (req, res, next) => {
      req.query.asruStatus = req.query.asruStatus || 'current';

      req.datatable.schema = req.query.asruStatus === 'current'
        ? omit(schema, 'removedAt')
        : omit(schema, 'assignedRoles');
      next();
    },
    getApiPath: (req, res, next) => {
      req.datatable.apiPath = ['/asru/profiles', { query: pick(req.query, ['asruStatus']) }];
      next();
    },
    getValues: (req, res, next) => {
      req.datatable.data.rows = req.datatable.data.rows.map(profile => {
        const assignedRoles = [];
        if (profile.asruInspector) {
          assignedRoles.push('Inspector');
        }
        if (profile.asruLicensing) {
          assignedRoles.push('Licensing Officer');
        }
        if (profile.asruSupport) {
          assignedRoles.push('Business Support');
        }
        if (profile.asruAdmin) {
          assignedRoles.push('Admin');
        }
        if (profile.asruRops) {
          assignedRoles.push('Returns analyst');
        }
        return {
          ...profile,
          assignedRoles
        };
      });
      return next();
    },
    locals: (req, res, next) => {
      set(res.locals, 'static.query.asruStatus', req.query.asruStatus);
      return next();
    }
  })({ defaultRowCount: 20 }));

  return app;
};
