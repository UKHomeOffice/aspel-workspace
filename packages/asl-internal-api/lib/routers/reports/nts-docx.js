module.exports = () => (req, res, next) => {
  const { knex } = req.models;
  const isRaTrue = req.query.ra === true || req.query.ra === 'true' || req.query.ra === 'true?';
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
    .where('projects.issue_date', '>=', req.query.startDate)
    .where('projects.issue_date', '<', req.query.endDate)
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
