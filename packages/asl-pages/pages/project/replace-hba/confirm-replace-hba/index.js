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
            return next(err);
          }
        }

        // Build workflow params in the expected shape
        const params = {
          id: req.project.id,
          data: {
            token,
            filename,
            attachmentId,
            projectVersionId: req.project?.granted?.id,
            projectId: req.params.projectId,
            establishmentId: req.project?.establishment?.id
          },
          meta: {
            changedBy: req.user.profile.id
          }
        };

        const opts = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          json: params
        };

        await req.api(`/project/${req.params.projectId}/replace-hba`, opts);

        res.setFlash('HBA file replaced', `${filename} is now attached to this licence.`, 'success');
        return res.redirect(req.buildRoute('project.read', { projectId: req.params.projectId }));
      }

      return next(new Error('Invalid choice'));
    } catch (err) {
      return next(err);
    }
  });

  return app;
};
