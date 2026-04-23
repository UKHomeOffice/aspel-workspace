const assert = require('assert');

const hasSpecies = require('../../../lib/reports/ppl-list/has-species');

describe('PPL list hasSpecies helper', () => {
  it('uses schema_version for legacy schema projects', () => {
    const project = {
      schema_version: 1,
      data: {
        species: ['11']
      }
    };

    assert.equal(hasSpecies(project, 'catsOrDogs'), true);
  });

  it('includes species-other values for legacy schema projects', () => {
    const project = {
      schema_version: 1,
      data: {
        species: [],
        'species-other': ['19']
      }
    };

    assert.equal(hasSpecies(project, 'equidae'), true);
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

    assert.equal(hasSpecies(project, 'nhps'), true);
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

    assert.equal(hasSpecies(project, 'equidae'), true);
  });

  it('returns false when no species match', () => {
    const project = {
      schema_version: 2,
      data: {
        protocols: []
      }
    };

    assert.equal(hasSpecies(project, 'nhps'), false);
  });
});