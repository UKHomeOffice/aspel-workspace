module.exports = settings => {
  const { Profile } = settings.models;
  return (req, res, next) => {

    if (req.user.profile) {
      return next();
    }
    return Profile.query()
      .findOne({ userId: req.user.id })
      .eager('[roles, establishments, asru]')
      .then(profile => {
        req.user.profile = profile;
      })
      .then(() => next())
      .catch(next);

  };
};
