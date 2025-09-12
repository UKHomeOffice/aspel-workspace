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

    try {
      if (confirmHba === 'no') {
        const { token } = req.session.form?.hba || {};

        if (token) {
          delete req.session.form.hba;
          // DELETE FROM S3 AND DB
          await axios.delete(`${settings.attachments}/${token}`);
          console.log(`Deleted HBA with token: ${token}`);
          return res.redirect(req.buildRoute('project.replaceHba', { projectId: req.params.projectId }));
        }
      } else if (confirmHba === 'yes') {
        const { token, fileName } = req.session.form?.hba || {};

        if (!token) {
          return next(new Error('Missing HBA token for replacement'));
        }

        const opts = {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          json: {
            data: { token, fileName }
          }
        };

        // Backend API folder is matching URL structure, nextJS type pattern.
        return req
          .api(`/project/${req.projectId}/replace-hba`, opts)
          .then(() => res.redirect(req.buildRoute('project.replaceHba', { projectId: req.params.projectId })))
          .catch(next);
      } else {
        return next(new Error('Invalid choice'));
      }
    } catch (err) {
      console.error(err);
      return next(err);
    }
  });

  return app;
};
