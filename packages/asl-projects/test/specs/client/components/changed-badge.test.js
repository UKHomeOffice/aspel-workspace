import { hasMatchingChange } from '../../../../client/components/changed-badge';
import assert from 'assert';

describe('ChangedBadge', () => {

  describe('hasMatchingChange', () => {
    it('returns false if changes list is empty', () => {
      assert.equal(hasMatchingChange(['field1'], []), false);
      assert.equal(hasMatchingChange(['field1'], null), false);
      assert.equal(hasMatchingChange(['field1'], undefined), false);
    });

    it('returns false if fields list is empty', () => {
      assert.equal(hasMatchingChange([], ['field1']), false);
      assert.equal(hasMatchingChange(null, ['field1']), false);
      assert.equal(hasMatchingChange(undefined, ['field1']), false);
    });

    it('returns true if there is an exact match', () => {
      const fields = ['field1', 'field2'];
      const changes = ['field2', 'field3'];
      assert.equal(hasMatchingChange(fields, changes), true);
    });

    it('returns true if there is a wildcard match', () => {
      const fields = ['protocols.*.title'];
      const changes = ['protocols.123.title'];
      assert.equal(hasMatchingChange(fields, changes), true);
    });

    it('returns false if there are no matches', () => {
      const fields = ['field1', 'field2'];
      const changes = ['field3', 'field4'];
      assert.equal(hasMatchingChange(fields, changes), false);

      const fields2 = ['protocols.123.title'];
      const changes2 = ['protocols.*.description'];
      assert.equal(hasMatchingChange(fields2, changes2), false);
    });
  });
});
