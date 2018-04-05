const assert = require('assert');

describe('Smoke tests', () => {

  it('can log in', () => {
    browser.withUser('holc');
    const title = browser.getTitle();
    assert.equal(title, 'Research and testing with animals');
  });

  it('sees the establishment name in the h1', () => {
    browser.withUser('holc');
    const title = browser.getText('h1');
    assert.equal(title, 'University of Croydon');
  });

});
