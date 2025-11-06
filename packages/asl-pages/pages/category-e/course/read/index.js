const { page } = require('@asl/service/ui');
const { validate } = require('uuid');

module.exports = settings => {
  const app = page({ ...settings, root: __dirname });

  app.get('/', (req, res, next) => {
    res.locals.pageTitle = `${res.locals.static.content.pageTitle} - ${req.trainingCourse.title}`;
    next();
  });

  app.param('trainingCourseId', (req, res, next, trainingCourseId) => {
    if (!validate(trainingCourseId)) {
      return next();
    }
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
