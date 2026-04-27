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

const speciesLabels = Object.fromEntries(
  Object.entries(species).map(([type, speciesList]) => [type, new Set(
    speciesList
      .map(value => allSpecies.find(item => item.value === value))
      .filter(Boolean)
      .map(item => item.label)
  )])
);

const speciesValues = Object.fromEntries(
  Object.entries(species)
    .map(([type, list]) => [type, new Set(list)])
);

const getSpeciesValues = project => {
  let speciesValuesForProject;

  // schema_version is not camelCased because it came from a raw knex query
  if (project.schema_version === 1) {
    speciesValuesForProject = []
      .concat(get(project, 'data.species', []))
      .concat(get(project, 'data.species-other', []));
  } else {
    speciesValuesForProject = [];
    for (const protocol of get(project, 'data.protocols', [])) {
      for (const specimen of (protocol.species || [])) {
        speciesValuesForProject.push(specimen.speciesId === '28' ? specimen['other-species-type'] : specimen.speciesId);
      }
    }
  }

  return new Set(speciesValuesForProject.filter(Boolean));
};

const matches = (speciesValuesForProject, type) => {
  return Array.from(speciesValuesForProject).some(value => speciesValues[type].has(value) || speciesLabels[type].has(value));
};

const hasSpecies = (project, type) => matches(getSpeciesValues(project), type);

module.exports = hasSpecies;
