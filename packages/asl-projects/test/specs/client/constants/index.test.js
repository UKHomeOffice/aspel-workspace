import assert from 'assert';
import constants from '../../../../client/constants/index.js';

describe('client/constants', () => {
  it('exposes DATE_FORMAT for named-import consumers', () => {
    assert.ok(constants.DATE_FORMAT);
    assert.equal(constants.DATE_FORMAT.long, 'D MMMM YYYY');
    assert.equal(constants.DATE_FORMAT.short, 'D/M/YYYY');
  });
});



