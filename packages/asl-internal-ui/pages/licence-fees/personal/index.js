const { page } = require('@asl/service/ui');
const { datatable } = require('@asl/pages/pages/common/routers');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(datatable({
    configure: (req, res, next) => {
      req.datatable.sort = { column: 'licenceHolder', ascending: true };
      next();
    },
    getApiPath: (req, res, next) => {
      const query = {
        startDate: req.financialYear.startDate,
        endDate: req.financialYear.endDate,
        onlyBillable: true
      };
      req.datatable.apiPath = ['/billing/pils', { query }];
      next();
    }
  })({ schema, defaultRowCount: 30 }));

  return app;
};
