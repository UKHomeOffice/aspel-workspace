const { each, uniq, isArray } = require('lodash');

const getContentSecurityPolicy = config => {
  const csp = config.csp || [];
  const directives = {
    defaultSrc: [`'none'`],
    styleSrc: [`'self'`],
    imgSrc: [`'self'`],
    fontSrc: [`'self'`, 'data:'],
    scriptSrc: [`'self'`, (req, res) => `'nonce-${res.locals.static.nonce}'`]
  };

  const gaDirectives = {
    scriptSrc: 'www.google-analytics.com',
    imgSrc: 'www.google-analytics.com'
  };

  if (config.gaTagId) {
    directives.scriptSrc = directives.scriptSrc.concat(gaDirectives.scriptSrc);
    directives.imgSrc = directives.imgSrc.concat(gaDirectives.imgSrc);
  }

  each(csp, (value, name) => {
    if (directives[name] && directives[name].length) {
      // concat unique directives with existing directives
      directives[name] = uniq(directives[name].concat(value));
    } else {
      directives[name] = isArray(value) ? value : [value];
    }
  });

  return directives;
};

module.exports = getContentSecurityPolicy;
