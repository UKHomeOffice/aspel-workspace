module.exports = () => {

  return (req, res, next) => {
    const method = req.method.toLowerCase();
    // if request is a get and the profile is stale then refresh it
    if (method === 'get' && req.session.profile.stale) {
      return req.user.refreshProfile()
        .then(() => next())
        .catch(next);
    }
    // mark the profile cache as stale if updating data
    if (method !== 'get') {
      req.session.profile.stale = true;
    }
    next();
  };

};
