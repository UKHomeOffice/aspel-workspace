const { Router } = require('express');
const routes = require('./routes');
const { validate } = require('uuid');

module.exports = _settings => {
  const app = Router({ mergeParams: true });

  app.param('trainingCourseId', (req, res, next, trainingCourseId) => {
    if (!validate(trainingCourseId)) {
      return next();
    }
    req.api(`/establishment/${req.establishmentId}/training-course/${trainingCourseId}`)
      .then(response => {
        return response.json.data;
      })
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
