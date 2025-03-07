module.exports = settings => (req, res, next) => {
  const domain = req.body.to.split('@')[1];

  const isAllowed = settings.whitelist.reduce((matched, d) => {
    return matched || d.toLowerCase() === domain.toLowerCase();
  }, false);

  if ((isAllowed || settings.whitelist.length === 0) && !settings.ignore.includes(req.body.to)) {
    return next();
  }

  console.log(`Skipping email to non-whitelisted address: ${req.body.to}`);
  console.log({
    template: req.params.template,
    subject: req.body.subject,
    data: req.body
  });

  res.json({});

};
