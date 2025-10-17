const { Router } = require('express');
module.exports = () => {
  const app = Router({ mergeParams: true });

  app.get('/', (req, res) => res.sendResponse());

  app.post('/', (req, res) => {
    return res.redirect(req.buildRoute('categoryE.course.add', {suffix: 'confirm'}));
  });

  return app;
};
