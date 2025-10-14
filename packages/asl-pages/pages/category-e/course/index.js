const { Router } = require('express');
const routes = require('./routes');

module.exports = _settings => {
  const app = Router({ mergeParams: true });

  app.use(
    (req, res, next) => {
      next();
    });

  app.param('trainingCourseId', (req, res, next, trainingCourseId) => {
    req.api(`/establishment/${req.establishmentId}/training-course/${trainingCourseId}`)
      .then(response => response.json.data)
      .then(trainingCourse => {
        req.trainingCourseId = trainingCourseId;
        req.trainingCourse = trainingCourse;
        req.model = trainingCourse;
        res.locals.static.trainingCourse = trainingCourse;
        res.locals.model = trainingCourse;
        next();
      })
      .catch(next);
  });

  return app;
};

module.exports.routes = routes;
