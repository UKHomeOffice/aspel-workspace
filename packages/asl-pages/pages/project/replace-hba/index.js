const { page } = require('@asl/service/ui');
const { form } = require('../../common/routers');
const schema = require('../../task/schema/upload-hba');
const uploadToAttachments = require('../../../lib/upload-to-attachments');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(
    form({
      schema,
      locals(req, res, next) {
        res.locals.static.establishment = req.establishment;
        return next();
      },
      process: async (req, res, next) => {
        const file = req.files && req.files.upload && req.files.upload[0];
        if (!file) {
          return next();
        }

        try {
          const data = await uploadToAttachments(settings.attachments, file);

          req.session.form = req.session.form || {};
          req.session.form.hba = {
            token: data.token,
            filename: file.originalname
          };
          return next();
        } catch (error) {
          return next(error);
        }
      }
    })
  );

  app.post('/', (req, res) => {
    res.redirect(req.buildRoute('project.confirmReplaceHba', { projectId: req.params.projectId }));
  });

  return app;
};
