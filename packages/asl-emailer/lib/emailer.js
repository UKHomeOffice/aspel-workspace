const { NotifyClient } = require('notifications-node-client');

module.exports = settings => {

  const client = new NotifyClient(settings.email.apiKey);

  return ({ to, content, subject }) => {
    const recipients = to.split(',');
    return Promise.all(recipients.map(recipient => {
      return client.sendEmail(settings.email.template, recipient, { personalisation: { content, subject } });
    }));
  };

};
