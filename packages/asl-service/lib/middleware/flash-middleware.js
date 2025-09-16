module.exports = function(req, res, next) {
  if (!req.session.flash) req.session.flash = {};

  // Set a flash message
  res.flash = (key, value) => {
    req.session.flash[key] = value;
  };

  // Get a flash message once
  res.locals.getFlash = (key) => {
    const value = req.session.flash[key];
    delete req.session.flash[key]; // remove after reading
    return value;
  };

  next();
};
