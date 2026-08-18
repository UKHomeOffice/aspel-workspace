const { render } = require('mustache');

/**
 * Prepends a page-specific label to the document title (WCAG 2.4.2 Page Titled).
 *
 * Routes scoped to a person already inherit `<licence holder> - <establishment>`
 * from the profile router's `profileId` param handler, and `base.jsx` appends the
 * site name, so a page only needs to declare what makes it unique:
 *
 *   'Animal types - Joe Bloggs - University of Croydon - Research and testing using animals'
 *
 * Labels are mustache templates so content can interpolate the model, e.g.
 * 'Suspend {{licenceType}} licence'. Use a triple-stache for anything free-text
 * (names, titles) — React escapes the title on output, so mustache must not.
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
