const { Router } = require('express');
const { omit, castArray } = require('lodash');

const form = require('../../../common/routers/form');
const { buildModel } = require('../../../../lib/utils');
const { processSpecies } = require('../../helpers');
const { modules: schema } = require('../schema');
const { moduleCodes } = require('@asl/constants');
const { species } = require('@asl/constants');
const content = require('../content/modules');

const { modulesThatRequireSpecies } = require('../../constants');

module.exports = () => {
  const app = Router();

  app.use('/', (req, res, next) => {
    const exemptions = req.profile.exemptions;
    req.model = buildModel(schema);

    req.model = exemptions.reduce((obj, value, key) => {
      const module = value.module;
      return {
        ...obj,
        modules: [ ...obj.modules, module ],
        [`module-${module}-reason`]: value.description,
        [`module-${module}-species`]: value.species
      };
    }, req.model);

    next();
  });

  app.use('/', form({
    configure: (req, res, next) => {
      req.form.schema = {
        ...schema,
        ...schema.modules.options.reduce((obj, val) => {

          const type = {
            ...obj,
            [`module-${val.value}-reason`]: val.reveal.reason,
            [`module-${val.value}-species`]: {
              inputType: 'select',
              options: species,
              label: content.fields.species.label
            }
          };
          return type;
        }, {})
      };
      next();
    },
    process: (req, res, next) => {
      Object.assign(
        (req.form.values = {
          ...req.form.values,
          ...processSpecies(req)
        })
      );
      next();
    },
    locals: (req, res, next) => {
      const revealValues = moduleCodes.map(c => `module-${c}-reason`).concat(moduleCodes.map(c => `module-${c}-species`));
      res.locals.static.schema = omit(req.form.schema, revealValues);
      res.locals.static.modulesThatRequireSpecies = modulesThatRequireSpecies;
      Object.assign(
        res.locals.static.content.errors,
        {
          ...moduleCodes.reduce((obj, code) => {
            return {
              ...obj,
              [`module-${code}-reason`]: {
                customValidate: `${res.locals.static.content.errors.reason.customValidate} ${code}`
              }
            };
          }, {})
        }
      );
      next();
    }
  }));

  app.post('/', (req, res, next) => {
    const ids = req.profile.exemptions.map(exemption => exemption.id);

    // TODO: refactor to allow addition of one exemption at a time.
    return Promise.all(
      ids.map(id => {
        const opts = {
          method: 'DELETE'
        };
        return req.api(`/establishment/${req.establishmentId}/profile/${req.profileId}/exemption/${id}`, opts);
      })
    )
      .then(() => {
        return Promise.all(
          req.form.values.modules.map(module => {
            const species = req.form.values[`module-${module}-species`];
            const opts = {
              method: 'POST',
              json: {
                data: {
                  module,
                  description: req.form.values[`module-${module}-reason`],
                  species: species ? castArray(species).filter(s => s !== '') : null
                }
              }
            };
            return req.api(`/establishment/${req.establishmentId}/profile/${req.profileId}/exemption`, opts);
          })
        );
      })
      .then(() => {
        delete req.session.form[req.model.id];
        return next();
      })
      .catch(next);
  });

  app.post('/', (req, res, next) => {
    return res.redirect(req.buildRoute('pil.update'));
  });

  return app;
};
