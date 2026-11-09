const { Router } = require('express');
const { submitParticipantForm, canEndorse } = require('./common');

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.get('/', (req, res, next) => {
    if (!canEndorse(req)) {
      return res.redirect(req.buildRoute('categoryE.course.addParticipant', { suffix: 'confirm' }));
    }

    return next();
  });

  app.post('/', submitParticipantForm(
    ({ firstName, lastName }) =>
      [
        `Category E PIL application submitted for ${firstName} ${lastName}`,
        'This application is now awaiting a decision from the Home Office.',
        'success'
      ]
  ));

  return app;
};
