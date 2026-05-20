import assert from 'assert';
import { removeNewDeleted } from '../../../../client/helpers/steps';

describe('helpers/steps removeNewDeleted', () => {
  it('keeps existing behaviour by hiding newly deleted steps', () => {
    const steps = [
      { id: 'existing-step', deleted: true },
      { id: 'new-step', deleted: true },
      { id: 'active-step', deleted: false }
    ];

    const previousSteps = [
      [{ id: 'existing-step' }]
    ];

    const result = removeNewDeleted(steps, previousSteps);

    assert.deepEqual(result, [
      { id: 'existing-step', deleted: true },
      { id: 'active-step', deleted: false }
    ]);
  });

  it('keeps newly deleted steps when feature-gated restore support is enabled', () => {
    const steps = [
      { id: 'existing-step', deleted: true },
      { id: 'new-step', deleted: true },
      { id: 'active-step', deleted: false }
    ];

    const previousSteps = [
      [{ id: 'existing-step' }]
    ];

    const result = removeNewDeleted(steps, previousSteps, true);

    assert.deepEqual(result, steps);
  });
});

