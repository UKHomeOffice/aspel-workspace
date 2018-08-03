const path = require('path');

const api = require('@asl/service/api');
const Emailer = require('snailmail');

module.exports = settings => {
  const app = api(settings);

  const mailer = Mailer({
    ...settings.email,
    templateDir: path.resolve(__dirname, 'templates'),
    layout: path.resolve(__dirname, 'templates/layout.html'),
    attachments: {
      hologo: path.resolve(__dirname, 'hologo.png')
    }
  });

  app.post('/:template', (req, res) => {
    mailer.send({
      template: req.params.template,
      to: req.body.to,
      subject: req.body.subject,
      data: req.body
    })
    .then(() => {
      res.json({});
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error });
    });
  });

  return app;
};
