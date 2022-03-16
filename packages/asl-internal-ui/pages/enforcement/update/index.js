const { page } = require('@asl/service/ui');

const flagsToSubjects = flags => {
  return flags.reduce((subjects, flag) => {
    const profileId = flag.profile.id;
    subjects[profileId] = subjects[profileId] || { flags: [] };
    subjects[profileId].establishment = subjects[profileId].establishment || flag.establishment;
    subjects[profileId].profile = subjects[profileId].profile || flag.profile;
    subjects[profileId].flags.push(flag);
    return subjects;
  }, {});
};

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res, next) => {
    req.enforcementCase.subjects = Object.values(flagsToSubjects(req.enforcementCase.flags));
    res.locals.static.enforcementCase = req.enforcementCase;
    next();
  });

  return app;
};
