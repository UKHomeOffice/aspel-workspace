const { page } = require('@asl/service/ui');
const { default: axios } = require('axios');
const { form } = require('../../../common/routers');
const schema = require('../schema/confirm-replace-hba');
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

  // this middleware is used to create radio buttons...
  app.use(
    form({
      configure(req, res, next) {
        req.form.schema = schema('amendment');
        next();
      }
    })
  );

  app.post('/', async (req, res, next) => {
    const { confirmHba } = req.form.values;
    const hbaSession = req.session.form?.hba || {};
    const { token, filename } = hbaSession;

    try {
      if (confirmHba === 'no') {
        if (token) {
          delete req.session.form.hba;
          await axios.delete(`${settings.attachments}/${token}`);
          console.log(`Deleted HBA with token: ${token}`);
        }
        return res.redirect(req.buildRoute('project.replaceHba', { projectId: req.params.projectId }));
      }

      if (confirmHba === 'yes') {
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
            console.warn(`Could not fetch/delete old HBA token ${oldToken}:`, err.message);
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
              projectVersionId: req.project?.granted?.id || null,
              projectId: req.params.projectId
            }
          }
        };

        return req.api(`/project/${req.params.projectId}/replace-hba`, opts)
          .then(() => res.redirect(req.buildRoute('project.read', { projectId: req.params.projectId })))
          .catch(next);
      }

      return next(new Error('Invalid choice'));
    } catch (err) {
      console.error(err);
      return next(err);
    }
  });

  return app;
};
