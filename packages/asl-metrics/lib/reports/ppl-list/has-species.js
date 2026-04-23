const { projectSpecies } = require('@ukhomeoffice/asl-constants');
const { flatten, values, get } = require('lodash');

const allSpecies = flatten(values(projectSpecies));

const species = {
  nhps: [
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
  ],
  catsOrDogs: [
    'cats',
    'dogs',
    'beagles',
    'other-dogs',
    // legacy values
    '7', // cats
    '11' //dogs
  ],
  equidae: [
    'horses',
    'ponies',
    'donkeys',
    'other-equidae',
    // legacy values
    '19' // horses
  ]
};

const speciesLabels = Object.entries(species).reduce((lookup, [type, speciesList]) => {
  lookup[type] = new Set(
    speciesList
      .map(value => allSpecies.find(item => item.value === value))
      .filter(Boolean)
      .map(item => item.label)
  );
  return lookup;
}, {});

const speciesValues = Object.entries(species).reduce((lookup, [type, speciesList]) => {
  lookup[type] = new Set(speciesList);
  return lookup;
}, {});

const getSpeciesValues = project => {
  let values;

  // schema_version is not camelCased because it came from a raw knex query
  if (project.schema_version === 1) {
    values = []
      .concat(get(project, 'data.species', []))
      .concat(get(project, 'data.species-other', []));
  } else {
    values = (get(project, 'data.protocols', [])).reduce((result, protocol) => {
      (protocol.species || []).forEach(specimen => {
        result.push(specimen.speciesId === '28' ? specimen['other-species-type'] : specimen.speciesId);
      });
      return result;
    }, []);
  }

  return new Set(values.filter(Boolean));
};

const matches = (values, type) => {
  for (const value of values) {
    if (speciesValues[type].has(value) || speciesLabels[type].has(value)) {
      return true;
    }
  }

  return false;
};

const hasSpecies = (project, type) => matches(getSpeciesValues(project), type);

module.exports = hasSpecies;
