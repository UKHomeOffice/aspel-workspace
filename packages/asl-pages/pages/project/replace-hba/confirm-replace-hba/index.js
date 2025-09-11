const { page } = require('@asl/service/ui');
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
          console.log('Deleted HBA unconfirmed replacement hba');
          return res.redirect(req.buildRoute('project.replaceHba', { projectId: req.params.projectId }));
        }
      }
    } catch (err) {
      console.error(err);
      return next(err);
    }
  });

  return app;
};
