import assert from 'assert';
import { changedFrom } from '../../../../client/helpers/changed-badge-helper';

describe('Changed Badge Helper', () => {
  const protocolId = '123';

  it('should return false for unchanged step when excludeSelf is true', () => {
    const fields = ['protocols.123.steps.1'];
    const changes = ['protocols.123.steps.1'];
    const result = changedFrom(fields, changes, protocolId, true);
    assert.equal(result, false);
  });

  it('should return true for changed step when excludeSelf is true', () => {
    const fields = ['protocols.123.steps.1'];
    const changes = ['protocols.123.steps.1', 'protocols.123.steps.1.title'];
    const result = changedFrom(fields, changes, protocolId, true);
    assert.equal(result, true);
  });

  it('should return true for Fate of Animals when excludeSelf is false', () => {
    const fields = ['protocols.123.fateOfAnimals'];
    const changes = ['protocols.123.fateOfAnimals'];
    const result = changedFrom(fields, changes, protocolId, false);
    assert.equal(result, true);
  });

  it('should return false when excludeSelf is incorrectly set to true (regression check)', () => {
    const fields = ['protocols.123.fateOfAnimals'];
    const changes = ['protocols.123.fateOfAnimals'];
    const result = changedFrom(fields, changes, protocolId, true);
    assert.equal(result, false);
  });
});
