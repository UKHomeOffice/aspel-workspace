const dayJs = require('@ukhomeoffice/asl-components/dayjs');

module.exports = ({ schema, logger, sendEmail }) => {
  const { Notification } = schema;

  return Promise.resolve()
    .then(() => Notification.query().where({ completed: null }).orderBy('createdAt', 'asc'))
    .then(notifications => {
      if (!notifications.length) {
        return Promise.resolve();
      }
      return notifications.reduce((promise, notification) => {
        return promise
          .then(() => sendEmail(notification))
          .then(() => notification.$query().patch({ completed: dayJs().toISOString() }))
          .catch(e => {
            logger.error(e.message);
          });
      }, Promise.resolve());
    });
};
