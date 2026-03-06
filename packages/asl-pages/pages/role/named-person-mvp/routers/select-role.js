const { Router } = require('express');
const { clearSessionIfNotFromTask } = require('../../../common/middleware');

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.get('/', clearSessionIfNotFromTask());

  app.post('/', (req, res, next) => {
    return res.redirect(
      req.buildRoute('role.namedPersonMvp', { suffix: 'before-you-apply' })
    );
  });

  return app;
};
