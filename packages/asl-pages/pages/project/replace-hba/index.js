const { page } = require('@asl/service/ui');
const { form } = require('../../common/routers');
const schema = require('../../task/schema/upload-hba');
const FormData = require('form-data');
const { default: axios } = require('axios');

module.exports = (settings) => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(
    form({
      schema,
      locals(req, res, next) {
        res.locals.static.establishment = req.establishment;
        next();
      },
      process: async (req, res, next) => {
        const file = req.files?.upload?.[0];
        if (!file) {
          console.log('No file found in request');
          return next();
        }

        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);

        try {
          const { data } = await axios.post(settings.attachments, formData, {
            headers: { ...formData.getHeaders() }
          });

          req.session.form = req.session.form || {};
          req.session.form.hba = {
            token: data.token,
            filename: file.originalname
          };
          next();
        } catch (error) {
          console.error('Upload error:', error);
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
