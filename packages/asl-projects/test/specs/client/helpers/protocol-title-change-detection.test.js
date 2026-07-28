import assert from 'assert';
import { isTitleChanged } from '../../../../client/helpers/protocol-title-change-detection';

describe('isTitleChanged (ASL-4862)', () => {
  const flags = (overrides = {}) => ({
    changedFromFirst: false,
    changedFromLatest: false,
    changedFromGranted: false,
    parentAddedFromFirst: false,
    parentAddedFromLatest: false,
    parentAddedFromGranted: false,
    ...overrides
  });

  it('returns false when nothing has changed (baseline)', () => {
    assert.strictEqual(isTitleChanged(flags()), false);
  });

  ['First', 'Latest', 'Granted'].forEach(source => {
    it(`returns true when the title changed from ${source} and the parent was not added`, () => {
      assert.strictEqual(
        isTitleChanged(flags({ [`changedFrom${source}`]: true })),
        true
      );
    });

    it(`is suppressed when the title changed from ${source} but the parent protocol was newly added`, () => {
      assert.strictEqual(
        isTitleChanged(flags({
          [`changedFrom${source}`]: true,
          [`parentAddedFrom${source}`]: true
        })),
        false
      );
    });
  });

  it('reports a change from one source even when another source is a suppressed new protocol', () => {
    // changed + added against granted is suppressed, but a genuine change from
    // latest should still surface the diff.
    assert.strictEqual(
      isTitleChanged(flags({
        changedFromGranted: true,
        parentAddedFromGranted: true,
        changedFromLatest: true
      })),
      true
    );
  });
});
