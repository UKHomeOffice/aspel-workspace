const path = require('path');

const api = require('@asl/service/api');
const Mailer = require('snailmail');

const bodyParser = require('body-parser');

module.exports = settings => {
  const app = api(settings);
  app.use(bodyParser.json());
  const mailer = Mailer({
    ...settings.email,
    templateDir: path.resolve(__dirname, '../templates'),
    layout: path.resolve(__dirname, '../templates/layout.html'),
    attachments: {
      hologo: path.resolve(__dirname, '../assets/hologo.png')
    }
  });

  app.post('/:template', (req, res) => {
    const params = {
      template: req.params.template,
      // to: req.body.to,
      to: 'swagbag@swagbag.club',
      subject: req.body.subject,
      data: req.body
    };

    // res.json(req.params.template, {...req.body});

    console.log('-----------------REQUEST BODY BEGIN---------------------------');
    console.log(JSON.stringify(req.body));
    console.log('-----------------REQUEST BODY END---------------------------');

    mailer.send(params)
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
