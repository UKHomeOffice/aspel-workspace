const openClosed = require('./open-closed');
const taskType = require('./task-type');
const establishment = require('./establishment');
const profiles = require('./profiles');

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
    console.error('Failed to load decorators:', error);
    // Return fallback decorators that don't fail
    return {
      openClosed,
      taskType,
      establishment: task => task,
      profiles: task => task
    };
  }
};
