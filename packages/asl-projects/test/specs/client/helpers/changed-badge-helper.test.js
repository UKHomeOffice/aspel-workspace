import assert from 'assert';
import { changedFrom } from '../../../../client/helpers/changed-badge-helper';

describe('Changed Badge Helper', () => {
  describe('changedFrom', () => {
    const protocolId = '123';

    it('filters out config fields that should not trigger badges', () => {
      const fields = ['protocols.123.steps.1.title'];
      const changes = [
        'protocols',
        'protocols.123',
        'protocols.123.steps',
        'protocols.123.steps.1',
        'protocols.123.steps.1.title',
        'protocols.123.steps.1.usedInProtocols',
      ];
      const result = changedFrom(fields, changes, protocolId, false);
      assert.equal(result, true);
    });

    it('returns false when only config fields are present', () => {
      const fields = ['protocols.123.steps.1.title'];
      const changes = [
        'usedInProtocols',
        'reusedStep',
        'reusableStepId',
        'usedInProtocols.protocolId',
        'usedInProtocols.protocolNumber',
      ];
      const result = changedFrom(fields, changes, protocolId, false);
      assert.equal(result, false);
    });

    it('excludeSelf=true: exact match should not count, sub-field change should count', () => {
      const fields = ['protocols.123.steps.1'];
      const changes = ['protocols.123.steps.1'];
      const result1 = changedFrom(fields, changes, protocolId, true);
      assert.equal(result1, false);

      const changes2 = ['protocols.123.steps.1', 'protocols.123.steps.1.title'];
      const result2 = changedFrom(fields, changes2, protocolId, true);
      assert.equal(result2, true);
    });

    it('excludeSelf=false: exact match should count', () => {
      const fields = ['protocols.123.steps.1'];
      const changes = ['protocols.123.steps.1'];
      const result = changedFrom(fields, changes, protocolId, false);
      assert.equal(result, true);
    });

    it('uses minimatch to support wildcard field matching', () => {
      const fields = ['protocols.123.steps.*.title'];
      const changes = ['protocols.123.steps.2.title'];
      const result = changedFrom(fields, changes, protocolId, false);
      assert.equal(result, true);
    });

    it('does not falsely match when wildcard does not align', () => {
      const fields = ['protocols.123.steps.*.title'];
      const changes = ['protocols.123.steps.2.description'];
      const result = changedFrom(fields, changes, protocolId, false);
      assert.equal(result, false);
    });

    it('retains items that are substrings of other items when filtering endsWith targets', () => {
      const fields = ['protocols.123.section'];
      const changes = ['protocols.123.section', 'protocols.123.section.title'];
      const result = changedFrom(fields, changes, protocolId, true);
      assert.equal(result, true);
    });

    it('no protocolId provided: should not filter config fields', () => {
      const fields = ['usedInProtocols'];
      const changes = ['usedInProtocols'];
      const result = changedFrom(fields, changes, null, false);
      assert.equal(result, true);
    });

    it('multiple fields: should match any matching change', () => {
      const fields = ['protocols.123.foo', 'protocols.123.bar'];
      const changes = ['protocols.123.bar'];
      const result = changedFrom(fields, changes, protocolId, false);
      assert.equal(result, true);
    });

    it('no changes: should return false', () => {
      const fields = ['protocols.123.any'];
      const changes = [];
      const result = changedFrom(fields, changes, protocolId, false);
      assert.equal(result, false);
    });

    it('empty fields: should return false regardless of changes', () => {
      const fields = [];
      const changes = ['protocols.123.title'];
      const result = changedFrom(fields, changes, protocolId, false);
      assert.equal(result, false);
    });

    it('protocolId set and all changes filtered out: returns false', () => {
      const fields = ['protocols.123.steps.1.title'];
      const changes = [
        'usedInProtocols',
        'reusedStep',
        'reusableStepId',
        'usedInProtocols.protocolId',
        'usedInProtocols.protocolNumber',
      ];
      const result = changedFrom(fields, changes, protocolId, false);
      assert.equal(result, false);
    });

    it('duplicate changes do not affect outcome', () => {
      const fields = ['protocols.123.steps.*.title'];
      const changes = [
        'protocols.123.steps.2.title',
        'protocols.123.steps.2.title',
      ];
      const result = changedFrom(fields, changes, protocolId, false);
      assert.equal(result, true);
    });
  });
});
