module.exports = () => (req, res, next) => {
  const { knex } = req.models;
  const isRaTrue = req.query.ra === true || req.query.ra === 'true' || req.query.ra === 'true?';
  const startTimestamp = `${req.query.startDate}T00:00:00.000Z`;
  const endTimestamp = `${req.query.endDate}T23:59:59.999Z`;
  return knex('projects')
    .select(
      'projects.title',
      'projects.ra_date',
      'projects.ra_granted_date',
      'projects.schema_version',
      'project_versions.data'
    )
    .distinctOn('projects.title', 'projects.id')
    .innerJoin('project_versions', 'projects.id', 'project_versions.project_id')
    .where('projects.issue_date', '>=', startTimestamp)
    .where('projects.issue_date', '<=', endTimestamp)
    .modify(queryBuilder => {
      if (isRaTrue) {
        queryBuilder.whereNotNull('projects.ra_date');
      } else {
        queryBuilder.whereNull('projects.ra_date');
      }
    })
    .orderBy([
      { column: 'projects.title', order: 'asc' },
      { column: 'projects.id' },
      { column: 'project_versions.updated_at', order: 'desc' }
    ])
    .then(projects => {
      res.response = projects.map(project => ({
        application: {
          title: project.title,
          raDate: project.raDate,
          raGrantedDate: project.raGrantedDate,
          schemaVersion: project.schemaVersion
        },
        data: typeof project.data === 'string' ? JSON.parse(project.data) : project.data
      }));
    })
    .then(() => next())
    .catch(next);
};
