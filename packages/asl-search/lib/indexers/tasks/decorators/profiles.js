const Cacheable = require('./cacheable');
const { get } = require('lodash');

const columns = ['id', 'firstName', 'lastName'];

module.exports = aslSchema => {
  const { Profile } = aslSchema;
  const cache = Cacheable();

  return async task => {
    const subjectId = get(task, 'data.subject');
    const licenceHolderId = get(task, 'data.modelData.licenceHolderId') || get(task, 'data.data.licenceHolderId');
    const assignedAsruId = get(task, 'assignedTo');

    const [subject, licenceHolder, assignedTo] = await Promise.all([
      subjectId ? cache.query(Profile, subjectId, columns) : Promise.resolve(null),
      licenceHolderId ? cache.query(Profile, licenceHolderId, columns) : Promise.resolve(null),
      assignedAsruId ? cache.query(Profile, assignedAsruId, columns) : Promise.resolve(null)
    ]);

    if (subject) task.subject = subject;
    if (licenceHolder) task.licenceHolder = licenceHolder;
    if (assignedTo) task.assignedTo = assignedTo;

    return task;
  };
};
