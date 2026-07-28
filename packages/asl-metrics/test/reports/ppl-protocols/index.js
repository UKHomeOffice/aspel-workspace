const assert = require('assert');

const reportProvider = require('../../../lib/reports/ppl-protocols');

describe('PPL protocols report', () => {
  let report;

  beforeEach(() => {
    report = reportProvider({ db: {} });
  });

  const baseProject = {
    licence_number: 'PPL-123',
    status: 'active',
    schema_version: 1,
    data: {
      polesList: [],
      establishments: []
    }
  };

  it('exports standard protocols with protocolType standard', () => {
    const result = report.parse({
      ...baseProject,
      data: {
        ...baseProject.data,
        protocols: [{
          title: 'Breeding',
          isStandardProtocol: true,
          standardProtocolType: 'standard',
          severity: 'mild',
          gaas: true,
          locations: [],
          fate: [],
          speciesDetails: [{
            name: 'Mice',
            'maximum-animals': 100,
            'maximum-times-used': 1,
            'life-stages': []
          }]
        }]
      }
    });

    assert.equal(result.length, 1);
    assert.equal(result[0].protocolType, 'standard');
  });

  it('exports editable protocols with protocolType editable', () => {
    const result = report.parse({
      ...baseProject,
      data: {
        ...baseProject.data,
        protocols: [{
          title: 'Breeding',
          isStandardProtocol: false,
          standardProtocolType: 'editable',
          severity: 'mild',
          gaas: true,
          locations: [],
          fate: [],
          speciesDetails: [{
            name: 'Rats',
            'maximum-animals': 25,
            'maximum-times-used': 1,
            'life-stages': []
          }]
        }]
      }
    });

    assert.equal(result.length, 1);
    assert.equal(result[0].protocolType, 'editable');
  });

  it('defaults experimental protocols to protocolType experimental', () => {
    const result = report.parse({
      ...baseProject,
      data: {
        ...baseProject.data,
        protocols: [{
          title: 'Experimental protocol',
          severity: 'moderate',
          gaas: false,
          locations: [],
          fate: [],
          speciesDetails: [{
            name: 'Hamsters',
            'maximum-animals': 10,
            'maximum-times-used': 2,
            'life-stages': []
          }]
        }]
      }
    });

    assert.equal(result.length, 1);
    assert.equal(result[0].protocolType, 'experimental');
  });

  it('exports legacy protocols as experimental', () => {
    const result = report.parse({
      ...baseProject,
      schema_version: 0,
      data: {
        ...baseProject.data,
        protocols: [{
          title: 'Legacy protocol',
          severity: 'mild',
          species: [{
            speciesId: '1',
            quantity: 5,
            'life-stages': []
          }],
          fate: []
        }]
      }
    });

    assert.equal(result.length, 1);
    assert.equal(result[0].protocolType, 'experimental');
  });
});
