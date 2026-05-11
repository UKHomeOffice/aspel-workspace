import assert from 'assert';

import { gaBreadingData } from '../../../../client/pages/sections/standard-protocols/prefilled-data/ga-breading-data';
import { BuildProtocol } from '../../../../client/pages/sections/standard-protocols/helpers/ga-breading/build-protocol';

describe('BuildProtocol severity normalisation', () => {
  const project = {
    species: ['mouse']
  };

  it('creates editable GA breeding protocols with a scalar severity string', () => {
    const template = gaBreadingData(false, true)
      .groups
      .flatMap(group => group.protocols)
      .find(protocol => protocol.value === 'rodent-breeding-mild');

    const protocol = BuildProtocol(template, project);

    assert.strictEqual(protocol.standardProtocolType, 'editable');
    assert.strictEqual(protocol.severity, 'mild');
    assert.strictEqual(Array.isArray(protocol.severity), false);
  });

  it('normalises legacy array-shaped severity values from template data', () => {
    const template = {
      label: 'Legacy editable template',
      data: {
        severity: ['moderate']
      }
    };

    const protocol = BuildProtocol(template, project);

    assert.strictEqual(protocol.severity, 'moderate');
  });
});

