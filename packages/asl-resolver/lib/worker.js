const { mapValues } = require('lodash');
const db = require('@asl/schema');

const JWT = require('./jwt');
const Emailer = require('./emailer');
const Resolvers = require('./resolvers');
const Changelog = require('./changelog');

module.exports = settings => {

  const models = db(settings.db);
  const jwt = JWT(settings.jwt);
  const emailer = Emailer(settings.emailer);

  const resolvers = mapValues(Resolvers, resolver => resolver({ models, jwt, emailer }));

  const changelog = Changelog(models.Changelog);

  return (message, done) => {

    Promise.resolve()
      .then(() => {
        return JSON.parse(message.Body);
      })
      .then(body => {
        console.log(body);
        if (!body.model || !resolvers[body.model]) {
          throw new Error(`Unknown model type: ${body.model}`);
        }
        const resolver = resolvers[body.model];
        return resolver(body)
          .then(changes => changelog(message.MessageId, body, changes));
      })
      .then(() => done())
      .catch(e => {
        console.error(e);
        done();
      });

  };

};
