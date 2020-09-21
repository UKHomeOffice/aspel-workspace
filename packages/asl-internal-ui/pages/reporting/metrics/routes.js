const pplSla = require('./ppl-sla');

module.exports = {
  pplSla: {
    path: '/ppl-sla',
    breadcrumb: false,
    router: pplSla
  }
};
