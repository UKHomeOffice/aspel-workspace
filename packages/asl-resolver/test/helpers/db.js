const Schema = require('@asl/schema');
const settings = require('@asl/schema/knexfile').test;

const tables = [
  'Changelog',
  'TrainingPil',
  'TrainingCourse',
  'ProjectProfile',
  'ProjectVersion',
  'Project',
  'Invitation',
  'Permission',
  'Authorisation',
  'PilTransfer',
  'FeeWaiver',
  'PIL',
  'PlaceRole',
  'Place',
  'Role',
  'Certificate',
  'Exemption',
  'AsruEstablishment',
  'Profile',
  'Establishment'
];

module.exports = {
  init: () => Schema(settings.connection),
  clean: schema => {
    return tables.reduce((p, table) => {
      return p.then(() => schema[table].queryWithDeleted().hardDelete());
    }, Promise.resolve());
  }
};
