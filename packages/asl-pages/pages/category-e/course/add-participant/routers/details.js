const { Router } = require('express');

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.get('/', (req, res) => res.sendResponse());

  app.post(
    '/',
    (req, res) =>
      res.redirect(req.buildRoute('categoryE.course.addParticipant', {suffix: 'confirm'}))
  );

  return app;
};
