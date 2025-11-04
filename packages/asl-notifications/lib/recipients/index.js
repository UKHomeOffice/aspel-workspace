const { get } = require('lodash');
const taskHelper = require('../utils/task');

const builders = {
  establishment: require('./establishment'),
  place: require('./establishment'),
  role: require('./establishment'),
  profile: require('./profile'),
  pil: require('./pil'),
  trainingPil: require('./training-pil'),
  project: require('./project'),
  projectProfile: require('./project-collaborators')
};
const allowedModels = Object.keys(builders);

const getModel = (task, logger) => {
  const model = get(task, 'data.model');

  if (!model || !allowedModels.includes(model)) {
    logger.error(`recipient list could not be determined for model '${model}'`);
    return null;
  }

  return model;
};

module.exports = ({ schema, logger, publicUrl }) => ({
  getNotifications: (task) => {
    const event = get(task, 'event');
    const model = getModel(task, logger);

    if (!model) {
      return Promise.resolve(new Map());
    }

    // notification not generated from task
    if (event === 'direct-notification') {
      return builders[model]({ schema, logger, task, publicUrl });
    }

    if (event === 'update' && taskHelper.allowedUpdate(task)) {
      return builders[model]({ schema, logger, task });
    }

    if (!event.match(/^status:/)) {
      logger.info(`ignoring non-status-change event '${task.event}'`);
      return Promise.resolve(new Map());
    }

    if (taskHelper.isIgnoredStatus(task)) {
      logger.info(`ignoring task.status '${task.status}'`);
      return Promise.resolve(new Map());
    }

    return builders[model]({ schema, logger, task, publicUrl });
  }
});
