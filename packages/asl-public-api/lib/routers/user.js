const { Router } = require('express');
const { fetchOpenTasks } = require('../middleware');

const router = Router();

router.use((req, res, next) => {
  Promise.resolve()
    .then(() => req.user.allowedActions())
    .then(allowedActions => {
      res.meta.allowedActions = allowedActions;
    })
    .then(() => next())
    .catch(next);
});

router.use((req, res, next) => {
  req.profileId = req.user.profile.id;
  next();
});

router.use(require('./profile/person'));

router.use((req, res, next) => {
  const { Invitation } = req.models;
  Promise.resolve()
    .then(() => {
      return Invitation.query()
        .where('email', 'iLike', req.user.profile.email)
        .eager('establishment(name)', {
          name: builder => builder.select('name')
        });
    })
    .then(invitations => {
      res.response = {
        ...res.response,
        invitations
      };
    })
    .then(() => next())
    .catch(next);
}, fetchOpenTasks);

module.exports = router;
