const { Router } = require('express');
const { get, omit } = require('lodash');
const { format } = require('date-fns');

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.post('/', (req, res, next) => {
    const values = get(req.session, `form[${req.model.id}].values`);

    const params = {
      method: 'POST',
      json: {
        data: {
          ...omit(values, ['id', 'dob']),
          dob: format(values.dob, 'yyyy-MM-dd')
        }
      }
    };

    req.api(`/establishment/${req.establishmentId}/training-course/${req.trainingCourseId}/training-pils`, params)
      .then(() => {
        const { firstName, lastName } = req.session.form[req.model.id].values;
        delete req.session.form[req.model.id];

        res.setFlash(
          `Category E PIL application submitted for ${firstName} ${lastName}`,
          'This application is now awaiting endorsement from the NTCO.',
          'success'
        );

        res.redirect(`${req.buildRoute('categoryE.course.read')}`);
      })
      .catch(next);
  });

  return app;
};
