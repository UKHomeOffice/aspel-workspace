const openClosed = require('./open-closed');
const taskType = require('./task-type');
const establishment = require('./establishment');
const profiles = require('./profiles');
const logger = require('../../../logger');

module.exports = async (aslSchema) => {
  try {
    const [establishmentDecorator, profilesDecorator] = await Promise.allSettled([
      establishment(aslSchema),
      profiles(aslSchema)
    ]);

    return {
      openClosed,
      taskType,
      establishment: establishmentDecorator.status === 'fulfilled' ? establishmentDecorator.value : task => task,
      profiles: profilesDecorator.status === 'fulfilled' ? profilesDecorator.value : task => task
    };
  } catch (error) {
    logger.error('Failed to load decorators:', error);
    return {
      openClosed,
      taskType,
      establishment: task => task,
      profiles: task => task
    };
  }
};
