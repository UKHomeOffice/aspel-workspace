import assert from 'assert';
import { trainingRecordHolder } from '../../../../client/helpers/training-record-holder.mjs';

describe('trainingRecordHolder', () => {
  const licenceHolder = { firstName: 'Jane', lastName: 'Doe' };

  it('shows a prospective licence holder on a new application', () => {
    assert.deepEqual(trainingRecordHolder(licenceHolder, 'inactive'), {
      name: 'Jane Doe',
      status: 'Prospective licence holder'
    });
  });

  it('shows the licence holder on an amendment or granted licence', () => {
    assert.equal(trainingRecordHolder(licenceHolder, 'active').status, 'Licence holder');
  });

  it('returns null when there is no licence holder', () => {
    assert.equal(trainingRecordHolder(undefined, 'inactive'), null);
  });
});
