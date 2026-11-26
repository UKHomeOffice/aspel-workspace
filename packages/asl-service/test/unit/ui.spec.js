const { router } = require('../../ui');
const assert = require('assert');

describe('ui', () => {

  it('can initialise without error', function() {
    this.timeout(10000);
    assert.doesNotThrow(() => router({}));
  });

});
