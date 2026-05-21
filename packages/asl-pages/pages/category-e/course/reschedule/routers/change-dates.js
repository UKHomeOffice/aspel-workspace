const { Router } = require('express');

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.get('/', (req, res) => {
    return res.sendResponse();
  });

  app.post('/', (req, res) => {
    return res.redirect(req.buildRoute(
      'categoryE.course.reschedule',
      {suffix: 'confirm', trainingCourseId: req.trainingCourseId}
    ));
  });

  return app;
};
