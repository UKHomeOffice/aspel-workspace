const { projectSpecies } = require('@ukhomeoffice/asl-constants');
const { uniq } = require('lodash');

const legacySpecies = Object.freeze({
  '1': 'N/A',
  '2': 'Amphibians',
  '3': 'Animals taken from the wild',
  '4': 'Avian Eggs',
  '5': 'Birds',
  '6': 'Camelids',
  '7': 'Cats',
  '8': 'Cattle',
  '9': 'Cephalopods',
  '10': 'Deer',
  '11': 'Dogs',
  '12': 'Ferrets',
  '13': 'Fish - Zebra Fish',
  '14': 'Fish - all other fish',
  '15': 'Gerbils',
  '16': 'Goats, sheep',
  '17': 'Guinea-pigs',
  '18': 'Hamsters',
  '19': 'Horses',
  '20': 'Mice',
  '21': 'Non-human primates - new world (e.g. marmosets)',
  '22': 'Non-human primates - old world (e.g. macaques)',
  '23': 'Pigs',
  '24': 'Rabbits',
  '25': 'Rats',
  '26': 'Reptiles',
  '27': 'Seals',
  '28': 'Other species',
  '29': 'Goats',
  '30': 'Sheep'
});

const speciesList = Object.values(projectSpecies).flat();

function extractLegacy(data = {}) {
  const protocols = data.protocols || [];

  return protocols.flatMap(protocol =>
    (protocol.species || []).map(s =>
      s.speciesId === '28' ? s['other-species-type'] : legacySpecies[s.speciesId]
    )
  );
}

function extractModern(data = {}) {
  const fields = [
    'species',
    'species-other',
    'species-other-birds',
    'species-other-dogs',
    'species-other-equidae',
    'species-other-fish',
    'species-other-rodents'
  ];

  return fields
    .flatMap(field => data[field] || [])
    .filter(s => typeof s === 'string' && !s.startsWith('other-'))
    .map(s => {
      const match = speciesList.find(sp => sp.value === s);
      return match ? match.label : s;
    });
}

module.exports = (data, { schemaVersion, id }) => {
  try {
    const extractor = schemaVersion === 0 ? extractLegacy : extractModern;
    return uniq(extractor(data)).filter(Boolean);
  } catch (err) {
    console.error(`Failed to extract species from project ${id}: ${err.message}`);
    return [];
  }
};
