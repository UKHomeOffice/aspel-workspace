const page = require('../../../lib/page');
const form = require('../../common/routers/form');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    root: __dirname,
    ...settings
  });

  app.use('/', form({ schema }));

  app.post('/', (req, res, next) => {
    const values = req.session.form[req.model.id].values;
    console.log('TRAINING MODULES FORM VALUES ', JSON.stringify(values));

    const opts = {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(values)
    };

    delete req.session.form[req.model.id];

    return req.api(`/pil/training`, opts)
      .then(() => next())
      .catch(next);
  });

  app.post('/', (req, res, next) => {
    return res.redirect(req.originalUrl.replace(/\/modules/, ''));
  });

  return app;
};
