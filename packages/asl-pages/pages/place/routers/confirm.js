const { Router } = require('express');
const { omit, pick, merge } = require('lodash');
const form = require('../../common/routers/form');
const { getEstablishment, getNacwoById } = require('../../common/helpers');
const { schema } = require('../schema');
const { updateDataFromTask, redirectToTaskIfOpen } = require('../../common/middleware');

module.exports = settings => {

  const sendData = (req, params = {}) => {
    const values = req.session.form[req.model.id].values;
    const opts = {
      method: settings.method,
      json: merge({
        data: omit(values, 'comments', 'comment', 'establishmentId', 'changesToRestrictions'),
        meta: {
          ...pick(values, 'comments', 'changesToRestrictions')
        }
      }, params)
    };

    return req.api(settings.apiUrl, opts);
  };

  const app = Router();

  app.post('/', updateDataFromTask(sendData));

  app.use(form({
    requiresDeclaration: req => !req.user.profile.asruUser,
    saveValues: (req, res, next) => {
      delete req.session.form[req.model.id].values.declaration;
      next();
    },
    locals: (req, res, next) => {
      Object.assign(res.locals, { model: req.model });
      Promise.all([
        getEstablishment(req),
        getNacwoById(req, req.form.values.nacwo)
      ])
        .then(([establishment, nacwo]) => {
          Object.assign(res.locals.static, {
            establishment,
            diffSchema: schema,
            values: {
              ...req.session.form[req.model.id].values,
              nacwo
            }
          });
        })
        .then(() => next())
        .catch(next);
    },
    checkSession: (req, res, next) => {
      if (req.session.form && req.session.form[req.model.id]) {
        return next();
      }
      return res.redirect(req.buildRoute(settings.page));
    },
    editAnswers: (req, res, next) => {
      delete req.session.form[req.model.id].validationErrors;
      return res.redirect(req.buildRoute(settings.page));
    },
    cancelEdit: (req, res, next) => {
      return res.redirect(req.buildRoute('place.list'));
    }
  }));

  app.post('/', redirectToTaskIfOpen());

  app.post('/', (req, res, next) => {
    sendData(req)
      .then(() => next())
      .catch(next);
  });

  return app;
};
