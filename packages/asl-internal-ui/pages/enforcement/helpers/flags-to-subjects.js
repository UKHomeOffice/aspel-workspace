
// flags on enforcement cases are displayed grouped by subject (aka profile), so group them by profile id
const flagsToSubjects = flags => {
  const subjects = flags.reduce((subjects, flag) => {
    const profileId = flag.profile.id;
    subjects[profileId] = subjects[profileId] || { id: profileId, caseId: flag.caseId, flags: [] };
    subjects[profileId].establishment = subjects[profileId].establishment || flag.establishment;
    subjects[profileId].profile = subjects[profileId].profile || flag.profile;
    subjects[profileId].flags.push(flag);
    return subjects;
  }, {});

  return Object.values(subjects);
};

module.exports = flagsToSubjects;
