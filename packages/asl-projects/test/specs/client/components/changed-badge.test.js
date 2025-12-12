import { hasMatchingChange } from '../../../../client/components/changed-badge';
import assert from 'assert';

describe('ChangedBadge', () => {

  describe('hasMatchingChange', () => {
    it('returns false when changes list is empty or undefined', () => {
      assert.strictEqual(hasMatchingChange(['field1'], []), false);
      assert.strictEqual(hasMatchingChange(['field1'], null), false);
      assert.strictEqual(hasMatchingChange(['field1'], undefined), false);
    });

    it('returns false when fields list is empty or undefined', () => {
      assert.strictEqual(hasMatchingChange([], ['field1']), false);
      assert.strictEqual(hasMatchingChange(null, ['field1']), false);
      assert.strictEqual(hasMatchingChange(undefined, ['field1']), false);
    });

    it('matches exact field with reusableStepId sub-key', () => {
      const fields = ['field2.reusableStepId'];
      const changes = ['field2.reusableStepId'];
      assert.strictEqual(hasMatchingChange(fields, changes), true);
    });

    it('matches wildcard field against nested change path ending with reusableStepId', () => {
      const fields = ['protocols.*.title.*'];
      const changes = ['protocols.123.title.reusableStepId'];
      assert.strictEqual(hasMatchingChange(fields, changes), true);
    });

    it('does not match when reusableStepId is absent even if pattern matches', () => {
      const fields = ['protocols.*.title.*'];
      const changes = ['protocols.123.title'];
      assert.strictEqual(hasMatchingChange(fields, changes), false);
    });

    it('does not match when no fields align with changes', () => {
      const fields = ['field1', 'field2.*'];
      const changes = ['field3.reusableStepId'];
      assert.strictEqual(hasMatchingChange(fields, changes), false);
    });
  });
});
