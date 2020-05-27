const { NotifyClient } = require('notifications-node-client');

module.exports = settings => {

  const client = new NotifyClient(settings.email.apiKey);

  return ({ to, content, subject }) => {
    const recipients = to.split(',');
    return Promise.resolve()
      .then(() => {
        return Promise.all(recipients.map(recipient => {
          return client.sendEmail(settings.email.template, recipient, { personalisation: { content, subject } });
        }));
      })
      .catch(e => {
        // the notify client returns errors with a large amount of additional request metadata
        // this breaks the dynamic indexing in kibana so the logs are never ingested
        // create a new "clean" error with the message so that the logs can index correctly
        throw new Error(e.message);
      });
  };

};
