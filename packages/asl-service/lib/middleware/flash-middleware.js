module.exports = function(req, res, next) {
  // Initialise session flash if not already present
  if (!req.session.flash) {
    req.session.flash = null;
  }

  // Set a flash message with a standard shape
  res.setFlash = (title, body, type = 'success') => {
    req.session.flash = { title, body, type };
  };

  // Get and consume the flash message
  res.locals.getFlash = () => {
    const flash = req.session.flash;
    req.session.flash = null; // clear after reading
    return flash;
  };

  next();
};
