const api = require('@asl/service/api');
const errorHandler = require('@asl/service/lib/error-handler');

const whitelist = require('./whitelist');
const Renderer = require('./renderer');
const Emailer = require('./emailer');

module.exports = settings => {

  if (!settings.email.apiKey) {
    throw new Error(`GOVUK Notify API key is not defined`);
  }

  const app = api(settings);

  const render = Renderer(settings);
  const send = Emailer(settings);

  app.post('/:template', whitelist(settings));

  app.post('/:template', (req, res, next) => {

    Promise.resolve()
      .then(() => {
        return render(req.params.template, req.body);
      })
      .then(content => {
        return send({ content, subject: req.body.subject, to: req.body.to });
      })
      .then(() => {
        res.json({});
      })
      .catch(next);

  });

  app.use(errorHandler(settings));

  return app;
};
