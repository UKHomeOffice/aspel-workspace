import { hasMatchingChange } from '../../../../client/components/changed-badge';
import assert from 'assert';

describe('ChangedBadge', () => {

  describe.skip('hasMatchingChange', () => {
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

    describe('status: granted', () => {
      it('returns true when there is a matching change', () => {
        const fields = ['field1'];
        const changes = ['field1'];
        assert.strictEqual(hasMatchingChange(fields, changes, 'granted'), true);
      });

      it('returns true when there is a matching glob change', () => {
        const fields = ['field.*'];
        const changes = ['field.child'];
        assert.strictEqual(hasMatchingChange(fields, changes, 'granted'), true);
      });

      it('returns false when there are no matching changes', () => {
        const fields = ['field1'];
        const changes = ['field2'];
        assert.strictEqual(hasMatchingChange(fields, changes, 'granted'), false);
      });
    });

    describe('status: other (default)', () => {
      it('returns true when there is a matching change that includes reusableStepId', () => {
        const fields = ['field.reusableStepId'];
        const changes = ['field.reusableStepId'];
        assert.strictEqual(hasMatchingChange(fields, changes), true);
      });

      it('returns false when matching change does not include reusableStepId', () => {
        const fields = ['field1'];
        const changes = ['field1'];
        assert.strictEqual(hasMatchingChange(fields, changes), false);
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
    });
  });
});
