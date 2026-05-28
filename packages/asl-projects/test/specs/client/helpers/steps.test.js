import assert from 'assert';
import { removeNewDeleted } from '../../../../client/helpers/steps';

describe('removeNewDeleted', () => {
  const steps = [
    { id: 'existing-step', deleted: true },
    { id: 'new-step', deleted: true },
    { id: 'active-step', deleted: false }
  ];

  const previousSteps = [
    [{ id: 'existing-step' }]
  ];

  describe('when restore support is disabled', () => {
    it('removes newly deleted steps that do not exist in previous steps', () => {
      const result = removeNewDeleted(steps, previousSteps);

      assert.deepEqual(result, [
        { id: 'existing-step', deleted: true },
        { id: 'active-step', deleted: false }
      ]);
    });
  });

  describe('when restore support is enabled', () => {
    it('keeps newly deleted steps so they can be restored', () => {
      const result = removeNewDeleted(steps, previousSteps, true);

      assert.deepEqual(result, steps);
    });
  });
});

