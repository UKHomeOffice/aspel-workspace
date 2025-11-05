const { Router } = require('express');
const { get, omit } = require('lodash');
module.exports = () => {
  const app = Router({ mergeParams: true });

  app.get('/', (req, res) => res.sendResponse());

  app.post('/', (req, res, next) => {
    const values = get(req.session, `form[${req.model.id}].values`);
    const params = {
      method: 'POST',
      json: {
        data: omit(values, 'id')
      }
    };

    req.api(`/establishment/${req.establishmentId}/training-courses`, params)
      .then(response => {
        delete req.session.form[req.model.id];
        const trainingCourseId = get(response, 'json.data.data.id');
        res.setFlash(
          'Course added',
          'Apply for category E PILs to add participants to the course.',
          'success'
        );

        res.redirect(req.buildRoute('categoryE.course.read', { trainingCourseId }));
      })
      .catch(next);
  });

  return app;
};
