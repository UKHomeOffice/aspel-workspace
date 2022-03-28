
const flagsToSubjects = flags => {
  const subjects = flags.reduce((subjects, flag) => {
    const profileId = flag.profile.id;
    subjects[profileId] = subjects[profileId] || { id: profileId, flags: [] };
    subjects[profileId].establishment = subjects[profileId].establishment || flag.establishment;
    subjects[profileId].profile = subjects[profileId].profile || flag.profile;
    subjects[profileId].flags.push(flag);
    return subjects;
  }, {});

  return Object.values(subjects);
};

module.exports = flagsToSubjects;
