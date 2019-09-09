const form = require('../../../common/routers/form');
const { Router } = require('express');
const { set, get, pick } = require('lodash');
const getSchema = require('../../schema/confirm');

module.exports = () => {
  const app = Router();

  app.use((req, res, next) => {
    req.breadcrumb('task.confirm');
    req.model = { id: req.task.id };
    const status = get(req, `session.form[${req.task.id}].values.status`);
    if (!status) {
      return res.redirect(req.buildRoute('task.read'));
    }
    next();
  });

  app.use(form({
    configure: (req, res, next) => {
      const chosenStatus = get(req, `session.form[${req.task.id}].values.status`);
      req.schema = getSchema(req.task, chosenStatus);
      req.form.schema = req.schema;
      next();
    },
    locals: (req, res, next) => {
      const values = get(req, `session.form[${req.task.id}].values`);

      set(res, 'locals.static', {
        ...res.locals.static,
        task: req.task,
        values
      });

      next();
    }
  }));

  app.post('/', (req, res, next) => {
    const values = req.session.form[`${req.task.id}`];
    if (values.returnTo) {
      // preserve http method
      return res.redirect(307, values.returnTo);
    }
    next();
  });

  app.post('/', (req, res, next) => {
    const values = req.session.form[`${req.task.id}`].values;

    const opts = {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      json: {
        status: values.status,
        data: values.data,
        meta: {
          ...values.meta,
          ...pick(values, 'comment', 'restrictions')
        }
      }
    };

    return req.api(`/tasks/${req.task.id}/status`, opts)
      .then(() => next())
      .catch(next);
  });

  app.post('/', (req, res, next) => {
    return res.redirect(req.buildRoute('task.success'));
  });

  return app;
};
