const { Router } = require('express');
const { submitParticipantForm, canEndorse } = require('./common');

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.get('/', (req, res, next) => {
    res.locals.static.canEndorseParticipant = canEndorse(req);

    return next();
  });

  app.post('/', (req, res, next) => {
    if (canEndorse(req)) {
      return res.redirect(req.buildRoute('categoryE.course.addParticipant', { suffix: 'endorse' }));
    }

    return next();
  });

  app.post('/', submitParticipantForm(
    ({ firstName, lastName }) =>
      [
        `Category E PIL application submitted for ${firstName} ${lastName}`,
        'This application is now awaiting endorsement from the NTCO.',
        'success'
      ]
  ));

  return app;
};
