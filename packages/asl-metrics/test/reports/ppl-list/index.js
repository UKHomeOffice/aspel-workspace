const { projectSpecies } = require('@ukhomeoffice/asl-constants');

const hasSpecies = require('../../../lib/reports/ppl-list/has-species');

describe('PPL list hasSpecies helper', () => {
  it('uses schema_version for legacy schema projects', () => {
    const project = {
      schema_version: 1,
      data: {
        species: ['11']
      }
    };

    expect(hasSpecies(project, 'catsOrDogs')).toBe(true);
  });

  it('includes species-other values for legacy schema projects', () => {
    const project = {
      schema_version: 1,
      data: {
        species: [],
        'species-other': ['19']
      }
    };

    expect(hasSpecies(project, 'equidae')).toBe(true);
  });

  it('uses protocol species values for schema v2+ projects', () => {
    const project = {
      schema_version: 2,
      data: {
        protocols: [
          {
            species: [
              { speciesId: '21' }
            ]
          }
        ]
      }
    };

    expect(hasSpecies(project, 'nhps')).toBe(true);
  });

  it('uses other-species-type when speciesId is 28 in schema v2+ projects', () => {
    const project = {
      schema_version: 2,
      data: {
        protocols: [
          {
            species: [
              {
                speciesId: '28',
                'other-species-type': 'donkeys'
              }
            ]
          }
        ]
      }
    };

    expect(hasSpecies(project, 'equidae')).toBe(true);
  });

  it('returns false when no species match', () => {
    const project = {
      schema_version: 2,
      data: {
        protocols: []
      }
    };

    expect(hasSpecies(project, 'nhps')).toBe(false);
  });

  it('matches known species labels in schema v2+ projects', () => {
    const equidaeValues = ['horses', 'ponies', 'donkeys', 'other-equidae', '19'];
    const allSpecies = Object.values(projectSpecies).reduce((result, group) => result.concat(group), []);
    const matchingSpecies = allSpecies.find(item => equidaeValues.includes(item.value) && item.label !== item.value);

    expect(matchingSpecies).toBeTruthy();

    const project = {
      schema_version: 2,
      data: {
        protocols: [
          {
            species: [
              {
                speciesId: '28',
                'other-species-type': matchingSpecies.label
              }
            ]
          }
        ]
      }
    };

    expect(hasSpecies(project, 'equidae')).toBe(true);
  });

  it('handles protocols without species arrays', () => {
    const project = {
      schema_version: 2,
      data: {
        protocols: [{}]
      }
    };

    expect(hasSpecies(project, 'nhps')).toBe(false);
  });

  it('filters out falsy species values before matching', () => {
    const project = {
      schema_version: 2,
      data: {
        protocols: [
          {
            species: [
              {
                speciesId: null
              },
              {
                speciesId: '28',
                'other-species-type': ''
              }
            ]
          }
        ]
      }
    };

    expect(hasSpecies(project, 'catsOrDogs')).toBe(false);
  });

  it('defaults legacy schema species arrays when data is missing', () => {
    const project = {
      schema_version: 1
    };

    expect(hasSpecies(project, 'equidae')).toBe(false);
  });
});
