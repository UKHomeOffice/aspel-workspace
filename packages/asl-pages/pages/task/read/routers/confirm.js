const form = require('../../../common/routers/form');
const { Router } = require('express');
const { set, get } = require('lodash');
const getSchema = require('../../schema/confirm');
const content = require('../content/confirm');
const {
  requiresDeclaration,
  getDeclarationText
} = require('../helpers/declarations');

module.exports = (config) => {
  const app = Router();

  app.use((req, res, next) => {
    req.model = { id: req.task.id };
    const values = get(req, `session.form[${req.task.id}].values`, {});
    const status = values.status;
    req.requiresDeclaration = requiresDeclaration(req.task, values);
    if (!status || status === req.task.status) {
      return res.redirect(req.buildRoute('task.read'));
    }

    next();
  });

  app.get('/', async (req, res, next) => {
    const model = get(req.task, 'data.model');
    const action = get(req.task, 'data.action');

    const values = get(req, `session.form[${req.task.id}].values`, {});
    const status = values.status;
    if (model === 'project' && ['grant', 'transfer', 'update'].includes(action) && status === 'resolved') {
      const { hbaToken, hbaFilename } = req.task.data.meta;

      if (!hbaToken) {
        return res.redirect(req.buildRoute('task.read'));
      }

      res.locals.static.hba = {
        hbaToken: hbaToken,
        hbaFilename
      };
    }
    next();
  });

  app.use(
    form({
      configure: (req, res, next) => {
        const chosenStatus = get(
          req,
          `session.form[${req.task.id}].values.status`
        );
        if (!chosenStatus) {
          req.notification({ key: 'form-session-error', type: 'error' });
          return res.redirect(req.buildRoute('task.read'));
        }
        const nextStep = req.task.nextSteps.find((s) => s.id === chosenStatus);
        if (!nextStep) {
          req.notification({ key: 'form-session-error', type: 'error' });
          return res.redirect(req.buildRoute('task.read'));
        }
        res.locals.static.commentRequired = nextStep.commentRequired;
        res.locals.static.commentLabel = content.commentLabels[chosenStatus];
        req.schema = getSchema({ task: req.task, chosenStatus });
        req.form.schema = req.schema;
        next();
      },
      locals(req, res, next) {
        const values = get(req, `session.form[${req.model.id}].values`);

        set(res, 'locals.static', {
          ...res.locals.static,
          task: req.task,
          requiresDeclaration: req.requiresDeclaration,
          values
        });

        if (values.status === 'intention-to-refuse') {
          set(res.locals.static, 'inspector', req.user.profile);
          set(
            res.locals.static,
            'content.status.intention-to-refuse.action.default',
            'Give reason for refusal'
          );
        }

        next();
      }
    })
  );

  app.post('/', (req, res, next) => {
    const { values, returnTo } = req.session.form[`${req.model.id}`];

    if (values.status === 'intention-to-refuse') {
      return res.redirect('review');
    }

    if (returnTo) {
      // preserve http method
      return res.redirect(307, returnTo);
    }
    next();
  });

  app.post('/', (req, res, next) => {
    const { values, meta } = req.session.form[req.model.id];

    const opts = {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      json: {
        data: values,
        meta
      }
    };

    if (req.requiresDeclaration) {
      opts.json.meta.declaration = getDeclarationText(req.task, values);
    }

    return req
      .api(`/tasks/${req.task.id}/status`, opts)
      .then((response) => {
        req.session.success = { taskId: get(response, 'json.data.id') };
        delete req.session.form[req.model.id];
        return res.redirect('success');
      })
      .catch(next);
  });

  return app;
};
