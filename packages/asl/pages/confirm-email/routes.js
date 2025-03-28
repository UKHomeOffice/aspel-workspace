const verify = require('./verify');

module.exports = {
  verify: {
    path: '/:token',
    breadcrumb: false,
    router: verify
  }
};
