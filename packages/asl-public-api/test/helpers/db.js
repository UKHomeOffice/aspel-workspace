const Schema = require('@asl/schema');

module.exports = settings => {

  return {
    init: (populate) => {
      const schema = Schema(settings);
      const tables = [
        'Project',
        'Permission',
        'Authorisation',
        'PIL',
        'Place',
        'Role',
        'TrainingModule',
        'Profile',
        'Establishment'
      ];
      return tables.reduce((p, table) => {
        return p.then(() => schema[table].query().delete());
      }, Promise.resolve())
        .then(() => populate && populate(schema))
        .then(() => schema.destroy())
        .catch(err => {
          schema.destroy();
          throw err;
        });
    }
  };

};
