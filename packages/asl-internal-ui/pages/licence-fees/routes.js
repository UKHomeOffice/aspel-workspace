const overview = require('./overview');
const establishments = require('./establishments');

module.exports = {
  overview: {
    path: '/:year',
    router: overview,
    breadcrumb: false
  },
  establishments: {
    path: '/:year/establishments',
    router: establishments,
    breadcrumb: false
  }
};
