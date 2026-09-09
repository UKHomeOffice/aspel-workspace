const { render } = require('mustache');

/**
 * Prepends a page-specific label to the document title (WCAG 2.4.2 Page Titled).
 */
const prependPageTitle = (req, res, label) => {
  if (!label) {
    return;
  }

  const view = {
    ...res.locals.static,
    model: req.model,
    profile: req.profile
  };

  res.locals.pageTitle = [render(String(label), view), res.locals.pageTitle]
    .filter(Boolean)
    .join(' - ');
};

/**
 * @param {string|function} [label] - a literal label, or `(req, res) => label`.
 *   Defaults to `content.pageTitle` for the resolved path.
 */
const setPageTitle = label => (req, res, next) => {
  prependPageTitle(req, res, typeof label === 'function'
    ? label(req, res)
    : label ?? res.locals.static.content.pageTitle
  );
  next();
};

module.exports = { setPageTitle, prependPageTitle };
