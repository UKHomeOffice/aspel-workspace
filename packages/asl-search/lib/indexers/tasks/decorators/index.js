const openClosed = require('./open-closed');
const taskType = require('./task-type');
const establishment = require('./establishment');
const profiles = require('./profiles');

module.exports = async aslSchema => {
  const [establishmentDecorator, profilesDecorator] = await Promise.all([
    establishment(aslSchema),
    profiles(aslSchema)
  ]);

  return {
    openClosed,
    taskType,
    establishment: establishmentDecorator,
    profiles: profilesDecorator
  };
};
