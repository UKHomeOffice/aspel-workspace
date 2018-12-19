const { Router } = require('express');
const datatable = require('@asl/pages/pages/common/routers/datatable');
const schema = require('../schema/search-people');

module.exports = settings => {
  const router = Router();

  router.use(datatable({
    getApiPath: (req, res, next) => {
      switch (req.query.searchType) {
        // case 'people':
        //   req.datatable.apiPath = `/search/profiles`;
        //   break;

        // case 'projects':
        //   req.datatable.apiPath = `/search/projects`;
        //   break;

        default:
          req.datatable.apiPath = `/search/profiles`;
          break;
      }
      return next();
    }
  })({ schema }));

  return router;
};
