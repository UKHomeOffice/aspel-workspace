const get = require('lodash/get');

module.exports = function pageTitle(req, res) {
  const explicitTitle = res.locals.pageTitle;

  if (explicitTitle) {
    return explicitTitle;
  }

  return get(res.locals, 'static.content.pageTitle')
    || get(res.locals, 'static.content.title')
    || get(res.locals, 'static.content.page.title');
};
