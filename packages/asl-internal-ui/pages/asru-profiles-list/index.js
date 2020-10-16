const { page } = require('@asl/service/ui');
const datatable = require('@asl/pages/pages/common/routers/datatable');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    root: __dirname,
    ...settings
  });

  app.use((req, res, next) => {
    res.locals.pageTitle = 'ASRU Staff Directory';
    next();
  });

  app.use(datatable({
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
        return {
          ...profile,
          assignedRoles
        };
      });
      return next();
    },
    locals: (req, res, next) => {
      return next();
    }
  })({ schema, apiPath: '/asru/profiles' }));

  return app;
};
