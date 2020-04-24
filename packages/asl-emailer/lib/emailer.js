const { NotifyClient } = require('notifications-node-client');

module.exports = settings => {

  const client = new NotifyClient(settings.email.apiKey);

  return ({ to, content, subject }) => {
    return client.sendEmail(settings.email.template, to, { personalisation: { content, subject } });
  };

};
