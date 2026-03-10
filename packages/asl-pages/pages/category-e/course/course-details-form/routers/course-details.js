const { Router } = require('express');
module.exports = ({baseRoute}) => {
  const app = Router({ mergeParams: true });

  app.get('/', (req, res) => res.sendResponse());

  app.post('/', (req, res) => {
    return res.redirect(req.buildRoute(baseRoute, {suffix: 'confirm', trainingCourseId: req.trainingCourseId}));
  });

  return app;
};
