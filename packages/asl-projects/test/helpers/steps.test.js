const assert = require('assert');

// helpers path from package root
const {
  hydrateSteps,
  removeNewDeleted,
  addDeletedReusableSteps,
  getTruncatedStepTitle
} = require('../../client/helpers/steps');

const { v4: uuidv4 } = require('uuid');

describe('helpers/steps', () => {
  describe('hydrateSteps', () => {
    it('should hydrate steps that reference reusableStepId with reusable step data and usedInProtocols', () => {
      const protocols = [
        {
          id: 'p1',
          steps: [
            { id: 's1', reusableStepId: 'r1' }
          ]
        },
        {
          id: 'p2',
          steps: [
            { id: 's2', reusableStepId: 'r1' }
          ]
        }
      ];

      const steps = [
        { id: 's1', reusableStepId: 'r1' },
        { id: 's3' }
      ];

      const reusableSteps = {
        r1: {
          id: 'r1',
          title: 'Reusable title',
          reference: 'Reusable reference'
        }
      };

      const [hydratedSteps, reusableArray] = hydrateSteps(protocols, steps, reusableSteps);

      // hydratedSteps should include the merged data for s1
      const s1 = hydratedSteps.find(s => s.id === 's1');
      assert.ok(s1, 'hydrated step s1 should exist');
      assert.strictEqual(s1.reusedStep, true, 'should mark reusedStep true');
      assert.strictEqual(s1.id, 's1');
      assert.strictEqual(s1.title, 'Reusable title');

      // usedInProtocols should contain protocol numbers [1,2]
      assert.ok(Array.isArray(s1.usedInProtocols), 'usedInProtocols should be an array');
      assert.strictEqual(s1.usedInProtocols.length, 2);
      const protocolNumbers = s1.usedInProtocols.map(p => p.protocolNumber).sort();
      assert.deepStrictEqual(protocolNumbers, [1,2]);

      // reusableArray should be an array containing the reusable step object
      assert.ok(Array.isArray(reusableArray));
      assert.strictEqual(reusableArray.length, 1);
      assert.strictEqual(reusableArray[0].id, 'r1');
    });
  });

  describe('removeNewDeleted', () => {
    it('should keep deleted steps if they exist in previous steps', () => {
      const steps = [
        { id: 'a', deleted: true },
        { id: 'b' }
      ];
      const previousSteps = [
        [ { id: 'a' }, { id: 'x' } ]
      ];

      const result = removeNewDeleted(steps, previousSteps);
      // deleted 'a' should be kept because it appears in previousSteps
      assert.strictEqual(result.length, 2);
      assert.ok(result.find(s => s.id === 'a'));
    });

    it('should remove deleted steps if they do not appear in previous steps', () => {
      const steps = [
        { id: 'a', deleted: true },
        { id: 'b' }
      ];
      const previousSteps = [
        [ { id: 'c' } ]
      ];

      const result = removeNewDeleted(steps, previousSteps);
      // deleted 'a' should be removed
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].id, 'b');
    });
  });

  describe('addDeletedReusableSteps', () => {
    it('should splice deleted reusable steps into the expected positions based on previousSteps', () => {
      const steps = [
        { id: 's1' },
        { id: 's3' }
      ];

      const previousSteps = [
        { id: 's1' },
        { id: 's2', reusableStepId: 'r2' },
        { id: 's3' }
      ];

      const reusableSteps = [
        { id: 'r2', title: 'Reusable 2', reference: 'R2' }
      ];

      const result = addDeletedReusableSteps([...steps], previousSteps, reusableSteps);
      // Expect s2 (from reusable) inserted between s1 and s3
      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[1].id, 'r2');
      assert.strictEqual(result[1].deleted, true);
      assert.strictEqual(result[1].title, 'Reusable 2');
    });
  });

  describe('getTruncatedStepTitle', () => {
    it('should return truncated plain-text title when provided slate-like object', () => {
      // Create minimal slate-like JSON structure similar to DB
      const slateTitle = {
        object: 'value',
        document: {
          data: {},
          nodes: [
            {
              object: 'block',
              type: 'paragraph',
              nodes: [ { object: 'text', text: 'This is a long step title that should be truncated' } ]
            }
          ]
        }
      };

      const step = { title: slateTitle };
      const truncated = getTruncatedStepTitle(step, 10);
      assert.strictEqual(truncated, 'This is a ');
    });
  });
});
