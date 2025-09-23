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
          return next(error);
        }
      }
    })
  );

  app.post('/', (req, res) => {
    res.redirect(req.buildRoute('project.confirmReplaceHba', { projectId: req.params.projectId }));
  });

  // Clear stale validationErrors on every load
  app.use((req, res, next) => {
    const form = req.session?.form;
    if (form && Object.keys(form).length > 0) {
      Object.keys(form).forEach(key => {
        const field = form[key];
        if (field?.validationErrors) {
          delete field.validationErrors;
        }
      });
    }
    next();
  });

  return app;
};
