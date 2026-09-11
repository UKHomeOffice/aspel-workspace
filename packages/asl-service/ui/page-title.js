const { render } = require('mustache');

/**
 * Prepends a page-specific label to the document title (WCAG 2.4.2 Page Titled).
 *
 * Parent routers set `res.locals.pageTitle` to shared context (e.g. licence holder and
 * establishment), so the label is what distinguishes one page in a journey from another.
 */
const prependPageTitle = (req, res, label) => {
  if (typeof label !== 'string' || !label) {
    return;
  }

  const view = {
    ...res.locals.static,
    model: req.model,
    profile: req.profile
  };

  res.locals.pageTitle = [render(label, view), res.locals.pageTitle]
    .filter(Boolean)
    .join(' - ');
};

/**
 * For titles that depend on request state. Static titles belong in `content.pageTitle`,
 * which `page()` applies automatically.
 *
 * @param {string|function} label - a literal label, or `(req, res) => label`.
 */
const setPageTitle = label => (req, res, next) => {
  prependPageTitle(req, res, typeof label === 'function' ? label(req, res) : label);
  next();
};

module.exports = { setPageTitle, prependPageTitle };
