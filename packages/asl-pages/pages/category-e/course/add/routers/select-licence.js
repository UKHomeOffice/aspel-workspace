const { Router } = require('express');
const { datatable } = require('../../../../common/routers');

const datatableSchema = {
  id: {show: true, sortable: false},
  projectTitle: {show: true},
  species: {show: true, sortable: false},
  licenceNumber: {show: true, sortable: false},
  expiryDate: {show: true}
};

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.use(datatable({
    configure: (req, res, next) => {
      req.datatable.sort = { column: 'expiryDate', ascending: true };
      next();
    },
    getApiPath: (req, res, next) => {
      req.datatable.apiPath = `/establishment/${req.establishmentId}/projects/cat-e`;
      next();
    }
  })({ schema: datatableSchema, defaultRowCount: 10 }));

  app.get('/', (req, res) => res.sendResponse());

  app.post('/', (req, res) => {
    return res.redirect(req.buildRoute('categoryE.course.add', {suffix: 'course-details'}));
  });

  return app;
};
