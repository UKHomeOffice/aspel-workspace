const { get } = require('lodash');
const { allowed } = require('./utils');

const can = ({ db, permissions }) => {
  const isAllowed = allowed({ db });

  return (user, task, subject) => {

    if (!user) {
      const err = new Error('Unknown user');
      err.status = 400;
      return Promise.reject(err);
    }

    const settings = get(permissions, task);
    const model = task.split('.')[0];
    if (!settings) {
      const err = new Error(`Unknown task: ${task}`);
      err.status = 404;
      return Promise.reject(err);
    }

    return isAllowed({ model, user, subject, permissions: settings });
  };
};

module.exports = can;
