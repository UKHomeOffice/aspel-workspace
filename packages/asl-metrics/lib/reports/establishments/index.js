const { omit, uniqBy } = require('lodash');

const getNames = (profiles, asruType) => {
  profiles = uniqBy(profiles.filter(p => p && p.id), 'id'); // filter nulls and dedupe

  if (asruType === 'licensing') {
    profiles = profiles.filter(profile => profile.asru_licensing);
  }

  if (asruType === 'inspector') {
    profiles = profiles.filter(profile => profile.asru_inspector);
  }

  return profiles.map(p => `${p.first_name} ${p.last_name}`).join(', ');
};

module.exports = ({ db }) => {

  const query = () => {
    const q = db.asl('establishments AS est')
      .select(
        'est.id',
        'est.name',
        'est.licence_number',
        'est.status',
        'est.issue_date',
        'est.revocation_date',
        'est.procedure',
        'est.breeding',
        'est.supplying',
        'est.killing',
        'est.rehomes',
        db.asl.raw('JSON_AGG(pelh) as pelh'),
        db.asl.raw('JSON_AGG(asru) as asru')
      )

      // PELH/NPRC
      .leftJoin('roles', builder => {
        builder.on('roles.establishment_id', '=', 'est.id')
          .andOn(b2 => {
            // filter the roles in the join, otherwise it only returns establishments with those roles assigned
            // onVal() is used here because on() causes pelh to be double-quoted and Postgres thinks it's a column name
            // onVal isn't currently documented but it was added here: https://github.com/knex/knex/pull/2746
            b2.onVal('roles.type', '=', 'pelh')
              .orOnVal('roles.type', '=', 'nprc');
          });
      })
      .leftJoin('profiles AS pelh', 'pelh.id', 'roles.profile_id')

      // inspectors and spocs
      .leftJoin('asru_establishment', 'asru_establishment.establishment_id', 'est.id')
      .leftJoin('profiles AS asru', 'asru.id', 'asru_establishment.profile_id')

      .groupBy('est.id')
      .orderBy('est.name');

    return q;
  };

  const parse = establishment => {
    const activePpls = db.asl('projects')
      .count('*')
      .where({ establishment_id: establishment.id, status: 'active' })
      .then(activePplCount => parseInt(activePplCount[0].count, 10));

    // submitted draft ppls: has at least one submitted version
    const submittedDrafts = db.asl('projects')
      .count('*')
      .where({ establishment_id: establishment.id, status: 'inactive' })
      .whereExists(builder => {
        builder.select('id')
          .from('project_versions')
          .where('status', 'submitted')
          .whereRaw('project_versions.project_id = projects.id');
      })
      .then(submittedDraftsCount => parseInt(submittedDraftsCount[0].count, 10));

    // unsubmitted draft ppls: has no submitted versions
    const unsubmittedDrafts = db.asl('projects')
      .count('*')
      .where({ establishment_id: establishment.id, status: 'inactive' })
      .whereNotExists(builder => {
        builder.select('id')
          .from('project_versions')
          .where('status', 'submitted')
          .whereRaw('project_versions.project_id = projects.id');
      })
      .then(unsubmittedDraftsCount => parseInt(unsubmittedDraftsCount[0].count, 10));

    return Promise.all([activePpls, submittedDrafts, unsubmittedDrafts])
      .then(([activeProjectCount, submittedDraftsCount, unsubmittedDraftsCount]) => {
        return {
          ...omit(establishment, 'asru'),
          pelh: getNames(establishment.pelh),
          spoc: getNames(establishment.asru, 'licensing'),
          inspector: getNames(establishment.asru, 'inspector'),
          'active_project_count': activeProjectCount,
          'submitted_drafts_count': submittedDraftsCount,
          'unsubmitted_drafts_count': unsubmittedDraftsCount
        };
      });
  };

  return { query, parse };

};
