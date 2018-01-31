const assert = require('assert');

describe('Hello World', () => {

  it('can log in', () => {
    browser.withUser('holc');
    const title = browser.getTitle();
    assert.equal(title, 'Animal Science Licensing');
  });

});
