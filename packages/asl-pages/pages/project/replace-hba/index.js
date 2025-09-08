const { page } = require('@asl/service/ui');
module.exports = (settings) => {
  const app = page({
    ...settings,
    root: __dirname,
    paths: ['/confirm-replace-hba']
  });

  app.post('/', (req, res) => {
    res.redirect(req.buildRoute('project.replaceHba', { suffix: 'confirm-replace-hba' }));
  });

  return app;
};
