const { get } = require('lodash');

module.exports = async aslSchema => {
  const { Profile } = aslSchema;

  const allProfiles = await Profile.query().select('id', 'firstName', 'lastName');
  const profileMap = new Map(allProfiles.map(p => [p.id, p]));
  console.log(`Preloaded ${allProfiles.length} profiles`);

  return task => {
    try {
      const subjectId = get(task, 'data.subject');
      const licenceHolderId = get(task, 'data.modelData.licenceHolderId') || get(task, 'data.data.licenceHolderId');
      const assignedAsruId = get(task, 'assignedTo');

      if (subjectId) {
        const profile = profileMap.get(parseInt(subjectId));
        if (profile) {
          task.subject = { id: profile.id, firstName: profile.firstName, lastName: profile.lastName };
        }
      }

      if (licenceHolderId) {
        const profile = profileMap.get(parseInt(licenceHolderId));
        if (profile) {
          task.licenceHolder = { id: profile.id, firstName: profile.firstName, lastName: profile.lastName };
        }
      }

      if (assignedAsruId) {
        const profile = profileMap.get(parseInt(assignedAsruId));
        if (profile) {
          task.assignedTo = { id: profile.id, firstName: profile.firstName, lastName: profile.lastName };
        }
      }
    } catch (err) {
      console.error(`Failed to decorate profiles for task ${task.id}:`, err.message);
    }
    return task;
  };
};
