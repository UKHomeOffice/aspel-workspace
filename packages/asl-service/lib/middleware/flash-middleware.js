module.exports = {
  initFlashMiddleware(req, res, next) {
    // Initialise session flash if not already present
    if (!req.session.flash) {
      req.session.flash = null;
    }

    // Set a flash message with a standard shape
    res.setFlash = (title, body, type = 'success') => {
      req.session.flash = { title, body, type };
    };

    next();
  },
  readFlashMiddleware(req, res, next) {
    res.locals.static.flash = { ...(req.session.flash ?? {}) };
    req.session.flash = {}; // remove after reading

    next();
  }
};
