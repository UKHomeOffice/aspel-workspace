const summary = require('./summary');

module.exports = {
  summary: {
    path: '/:year',
    router: summary,
    breadcrumb: false
  }
};
