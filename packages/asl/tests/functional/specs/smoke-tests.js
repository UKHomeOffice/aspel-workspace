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

  it('can access details page', () => {
    browser.withUser('holc');
    browser.click('a[href*="/details"]');
    const title = browser.getText('h1');
    assert.equal(title, 'Establishment Details');
  });

  it('can access people page', () => {
    browser.withUser('holc');
    browser.click('a[href*="/people"]');
    const title = browser.getText('h1');
    assert.equal(title, 'Named people and licence holders');
  });

  it('can access schedule of premises page', () => {
    browser.withUser('holc');
    browser.click('a[href*="/places"]');
    const title = browser.getText('h1');
    assert.equal(title, 'Licensed premises');
  });

});
