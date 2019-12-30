const { Router } = require('express');
const { form } = require('@asl/pages/pages/common/routers');
const schema = require('./schema');

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.use('/', (req, res, next) => {
    req.model = {
      id: 'pil-licences'
    };
    next();
  });

  app.use('/', form({ schema }));

  app.post('/', (req, res, next) => {
    const { comments } = req.form.values;
    const { pilId, billable } = req.body;
    const params = {
      method: 'PUT',
      json: {
        data: {
          billable: billable !== 'true'
        },
        meta: {
          comments
        }
      }
    };
    req.api(`/establishment/${req.establishmentId}/pil/${pilId}/billing`, params)
      .then(() => next())
      .catch(next);
  });

  app.post('/', (req, res, next) => {
    delete req.session.form[req.model.id].values;
    req.notification({ key: 'success' });
    res.redirect(req.buildRoute('establishment.fees.personal'));
  });

  app.get('/billing-history/:pilId', (req, res, next) => {
    const query = {
      action: 'set-billable',
      status: 'autoresolved'
    };
    req.api(`/model-history/${req.params.pilId}`, { query })
      .then(response => {
        res.json(response.json.data);
      })
      .catch(next);
  });

  return app;
};
