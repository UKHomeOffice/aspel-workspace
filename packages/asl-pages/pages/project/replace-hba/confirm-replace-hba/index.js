const { page } = require('@asl/service/ui');
const { default: axios } = require('axios');
const { form } = require('../../../common/routers');
const schema = require('./schema/confirm-replace-hba');
module.exports = (settings) => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    const hba = req.session.form?.hba;
    if (hba) {
      res.locals.static.hbaToken = hba.token;
      res.locals.static.hbaFilename = hba.filename;
    }

    next();
  });

  // form middleware
  app.use(
    form({
      configure(req, res, next) {
        req.form.schema = schema();
        next();
      },
      locals(req, res, next) {
        // pass HBA info to template
        res.locals.static.hbaToken = req.session.form?.hba?.token;
        res.locals.static.hbaFilename = req.session.form?.hba?.filename;
        next();
      }
    })
  );

  app.post('/', async (req, res, next) => {
    const { confirmHbaDeclaration, hbaReplacementReason } = req.form.values;
    const hbaSession = req.session.form?.hba || {};
    const { token, filename } = hbaSession;

    try {
      if (confirmHbaDeclaration === 'no') {
        if (token) {
          await axios.delete(`${settings.attachments}/${token}`);
          delete req.session.form;
        }
        return res.redirect(req.buildRoute('project.replaceHba', { projectId: req.params.projectId }));
      }

      if (confirmHbaDeclaration === 'yes') {
        if (!token) {
          return next(new Error('Missing HBA token for replacement'));
        }

        const oldToken = req.project?.granted?.hbaToken;
        let attachmentId = null;

        if (oldToken) {
          try {
            const { data } = await axios.get(`${settings.attachments}/attachment-id/${oldToken}`);
            attachmentId = data.id;
            await axios.delete(`${settings.attachments}/${oldToken}`);
          } catch (err) {
            next(err);
          }
        }

        const opts = {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          json: {
            data: {
              token,
              filename,
              attachmentId,
              hbaReplacementReason,
              declaration: confirmHbaDeclaration,
              projectVersionId: req.project?.granted?.id || null,
              projectId: req.params.projectId
            }
          }
        };

        return req.api(`/project-versions/${req.project?.granted?.id}/replace-hba`, opts)
          .then(() => res.setFlash('HBA file replaced', `${filename} is now attached to this licence.`, 'success'))
          .then(() => res.redirect(req.buildRoute('project.read', { projectId: req.params.projectId })))
          .catch(next);
      } else {
        return next(new Error('Invalid choice'));
      }
    } catch (err) {
      return next(err);
    }
  });

  return app;
};
