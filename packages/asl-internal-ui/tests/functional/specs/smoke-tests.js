const assert = require('assert');

describe('Smoke tests', () => {

  it('can log in', () => {
    browser.withUser('inspector');
    const title = browser.getTitle();
    assert.equal(title, 'Research and Testing with Animals');
  });

  it('sees the establishments page in the h1', () => {
    browser.withUser('inspector');
    const title = browser.getText('h1');
    assert.equal(title, 'Establishments');
  });

  it('can visit establishment page', () => {
    browser.withUser('inspector');
    browser.click('a[href*="/establishment/8201"]');
    const title = browser.getText('h1');
    assert.equal(title, 'University of Croydon');
  });

  it('can access schedule of premises page', () => {
    browser.withUser('inspector');
    browser.click('a[href*="/establishment/8201"]');
    browser.click('a[href*="/places"]');
    const title = browser.getText('h1');
    assert.equal(title, 'Licensed premises');
  });

  it('can access establishment details page', () => {
    browser.withUser('inspector');
    browser.click('a[href*="/establishment/8201"]');
    browser.click('a[href*="/details"]');
    const title = browser.getText('h1');
    assert.equal(title, 'Establishment Details');
  });

});
