const { Router } = require('express');

const router = Router();

router.use((req, res, next) => {
  const { Profile } = req.models;
  Promise.resolve()
    .then(() => {
      return Profile.query()
        .where({ userId: req.user.id })
        .eager('establishments');
    })
    .then(profiles => profiles[0])
    .then(profile => {
      req.profile = profile;
    })
    .then(() => next())
    .catch(next);
});

router.use((req, res, next) => {
  Promise.resolve()
    .then(() => req.user.can())
    .then(response => response.json)
    .then(allowedActions => {
      req.allowedActions = allowedActions;
    })
    .then(() => next())
    .catch(next);
});

module.exports = router;
