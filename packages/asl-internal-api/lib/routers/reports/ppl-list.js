const dayJs = require('@ukhomeoffice/asl-components/dayjs');
const { pick } = require('lodash');

const { formatIsoDate } = dayJs;

const hasSpecies = require('./utils/has-species');

const nhps = [
  'prosimians',
  'marmosets',
  'cynomolgus',
  'rhesus',
  'vervets',
  'baboons',
  'squirrel-monkeys',
  'other-old-world',
  'other-new-world',
  'other-nhps',
  'apes',
  // legacy values
  '21', // new world NHPs
  '22' // old world NHPs
];

const catsOrDogs = [
  'cats',
  'dogs',
  'beagles',
  'other-dogs',
  // legacy values
  '7', // cats
  '11' //dogs
];

const equidae = [
  'horses',
  'ponies',
  'donkeys',
  'other-equidae',
  // legacy values
  '19' // horses
];

module.exports = () => (req, res, next) => {
  const { knex } = req.models;

  return Promise.resolve()
    .then(() => {
      const results = [];
      return new Promise((resolve, reject) => {
        // use a knex query builder to access db streaming functionality
        // note: this means we don't have snake case mapper
        knex('projects')
          .select(
            'projects.*',
            'establishments.name',
            knex('project_versions')
              .select('project_versions.data')
              .where('project_versions.project_id', knex.raw('projects.id'))
              .where('project_versions.status', 'granted')
              .orderBy('project_versions.updated_at', 'desc')
              .first()
              .as('data')
          )
          .leftJoin('establishments', 'projects.establishment_id', 'establishments.id')
          .whereIn('projects.status', ['active', 'expired', 'revoked'])
          // stream results to avoid loading all data into memory
          .stream(stream => {
            stream.on('data', project => {
              results.push({
                ...pick(project, 'licence_number', 'title', 'status', 'schema_version'),
                issueDate: formatIsoDate(project.issue_date),
                expiryDate: formatIsoDate(project.expiry_date),
                revocationDate: project.revocation_date ? formatIsoDate(project.revocation_date) : '',
                establishment: project.name,
                nhps: hasSpecies(project, nhps) ? 'yes' : 'no',
                catsOrDogs: hasSpecies(project, catsOrDogs) ? 'yes' : 'no',
                equidae: hasSpecies(project, equidae) ? 'yes' : 'no'
              });
            });
            stream.on('end', () => resolve(results));
            stream.on('error', e => reject(e));
          });
      });
    })
    .then(projects => {
      res.response = projects;
    })
    .then(() => next())
    .catch(next);
};
