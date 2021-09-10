const { page } = require('@asl/service/ui');
const { pick, merge, flatten, uniq, omit } = require('lodash');
const getRopsSchema = require('@asl/pages/pages/rops/update/schema');
const getProceduresSchema = require('@asl/pages/pages/rops/procedures/schema');
const { fields: ropsFields } = require('@asl/pages/pages/rops/update/content');
const proceduresContent = require('@asl/pages/pages/rops/procedures/content');
const proceduresCreateContent = require('@asl/pages/pages/rops/procedures/create/content');
const { projectSpecies } = require('@asl/constants');

const proceduresFields = merge({}, proceduresContent.fields, proceduresCreateContent.fiels);

function getAllKeys(schema) {
  return uniq(flatten(Object.keys(schema).map(key => {
    const field = schema[key];
    if (!field.options) {
      return key;
    }
    return flatten([
      key,
      ...field.options.filter(opt => opt.reveal).map(opt => getAllKeys(opt.reveal))
    ]);
  })));
}

module.exports = () => {
  const app = page({ root: __dirname });

  app.use((req, res, next) => {
    const params = {
      rop: {
        project: {},
        purposes: [
          'basic',
          'regulatory',
          'translational'
        ],
        reuse: true,
        species: [
          'marmosets'
        ],
        procedures: []
      },
      version: {
        data: {}
      }
    };
    const ropsSchema = getRopsSchema(params);
    const proceduresSchema = getProceduresSchema(params);

    res.locals.static.species = flatten(Object.values(omit(projectSpecies, 'deprecated')));
    res.locals.static.ropsFields = pick(ropsFields, getAllKeys(ropsSchema));
    res.locals.static.proceduresFields = pick(proceduresFields, getAllKeys(proceduresSchema));
    next();
  });

  app.get('/', (req, res, next) => res.sendResponse());

  return app;
};
