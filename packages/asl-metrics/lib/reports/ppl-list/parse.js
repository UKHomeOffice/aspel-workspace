const dayJs = require('@ukhomeoffice/asl-components/dayjs');
const { pick, get } = require('lodash');

const { formatIsoDate } = dayJs;

const hasSpecies = require('./has-species');
const getPermissiblePurposes = require('./get-permissible-purposes');

const formatDuration = project => {
  if (!project.data || !project.data.duration) {
    return '-';
  }
  return `${project.data.duration.years} years ${project.data.duration.months} months`;
};

const parse = db => project => {

  return Promise.resolve()
    .then(() => {
      if (project.ra_date) {
        return db.flow('cases')
          .leftJoin('activity_log', 'cases.id', 'activity_log.case_id')
          .whereRaw(`data->>'action' = 'grant-ra'`)
          .whereRaw(`data->>'id' = ?`, [project.id])
          .whereRaw(`event->>'status' = 'with-inspectorate'`)
          .orderBy('activity_log.created_at', 'asc')
          .limit(1)
          .then(results => {
            project.ra_submitted_date = get(results, '[0].created_at');
          });
      }
    })
    .then(() => {
      return {
        ...pick(project, 'licence_number', 'title', 'status', 'schema_version'),
        isPartialRecord: project.is_legacy_stub,
        issueDate: formatIsoDate(project.issue_date),
        expiryDate: formatIsoDate(project.expiry_date),
        revocationDate: project.revocation_date ? formatIsoDate(project.revocation_date) : '',
        duration: formatDuration(project),
        establishment: project.name,
        nhps: hasSpecies(project, 'nhps') ? 'yes' : 'no',
        catsOrDogs: hasSpecies(project, 'catsOrDogs') ? 'yes' : 'no',
        equidae: hasSpecies(project, 'equidae') ? 'yes' : 'no',
        raDueDate: project.ra_date ? formatIsoDate(project.ra_date) : '',
        raSubmitDate: project.ra_submitted_date ? formatIsoDate(project.ra_submitted_date) : '',
        raGrantDate: project.ra_granted_date ? formatIsoDate(project.ra_granted_date) : '',
        permissiblePurposes: getPermissiblePurposes(project),
        establishmentLicenceNumber: project.establishmentLicenceNumber
      };
    });

};

module.exports = parse;
