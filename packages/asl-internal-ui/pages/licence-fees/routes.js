const overview = require('./overview');
const establishments = require('./establishments');
const personal = require('./personal');

module.exports = {
  overview: {
    path: '/overview',
    router: overview,
    breadcrumb: false
  },
  establishments: {
    path: '/establishments',
    router: establishments,
    breadcrumb: false
  },
  personal: {
    path: '/personal',
    router: personal,
    breadcrumb: false
  }
};
