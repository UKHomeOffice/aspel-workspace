import assert from 'assert';
import { changedFrom } from '../../../../client/helpers/changed-badge-helper';

describe('Changed Badge Helper', () => {
  describe('changedFrom', () => {
    const protocolId = '123';

    it('filters out config fields that should not trigger badges', () => {

      function expandChange(change) {
        const expandedChange = [];
        change
          .split('.')
          .reduce(
            (prefix, part) => {
              const next = [...prefix, part];
              expandedChange.push(next.join('.'));
              return next;
            },
            []
          );

        return expandedChange;
      }

      function expandChanges(changes) {
        // limit to unique changes
        const expandedChanges = new Set();

        changes
          .flatMap(change => expandChange(change))
          .forEach(change => expandedChanges.add(change));

        return [...expandedChanges];
      }

      const changes = expandChanges([
        'protocols.123.steps.1.title',
        'protocols.123.steps.1.usedInProtocols',
        'protocols.123.steps.1.reusedStep',
        'protocols.123.steps.1.reusableStepId',
        'protocols.123.steps.1.usedInProtocols.protocolId',
        'protocols.123.steps.1.usedInProtocols.protocolNumber',
      ]);

      function assertNoBadge(fields) {
        const result = changedFrom(fields, changes, protocolId, false);
        assert.equal(result, false);
      }

      assertNoBadge(['protocols.123.steps.1.usedInProtocols']);
      assertNoBadge(['protocols.123.steps.1.reusableStepId']);
      assertNoBadge(['protocols.123.steps.1.reusedStep']);
      assertNoBadge(['protocols.123.steps.1.usedInProtocols.protocolId']);
      assertNoBadge(['protocols.123.steps.1.usedInProtocols.protocolNumber']);
    });


    it('ignoreExactMatch=true: exact match should not count, sub-field change should count', () => {
      const fields = ['protocols.123.steps.1'];
      const changes = ['protocols.123.steps.1'];
      const result1 = changedFrom(fields, changes, protocolId, true);
      assert.equal(result1, false);

      const changes2 = ['protocols.123.steps.1', 'protocols.123.steps.1.title'];
      const result2 = changedFrom(fields, changes2, protocolId, true);
      assert.equal(result2, true);
    });

    it('ignoreExactMatch=false: exact match should count', () => {
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

    it('no protocolId provided: should not filter config fields', () => {
      const fields = ['usedInProtocols'];
      const changes = ['usedInProtocols'];
      const result = changedFrom(fields, changes, null, false);
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

    it('duplicate changes do not affect outcome', () => {
      const fields = ['protocols.123.steps.*.title'];
      const changes = [
        'protocols',
        'protocols.123',
        'protocols.123.steps',
        'protocols.123.steps.1',
        'protocols.123.steps.1.title',
        'protocols.123.steps.1.title',
      ];
      const result = changedFrom(fields, changes, protocolId, false);
      assert.equal(result, true);
    });
  });
});
