module.exports = {
  router: require('./router'),
  page: require('./page'),
  mountRoutes: require('./mount-routes'),
  featureFlag: require('./feature-flag'),
  setPageTitle: require('./page-title').setPageTitle,
  prependPageTitle: require('./page-title').prependPageTitle
};
