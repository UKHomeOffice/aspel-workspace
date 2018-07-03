const assert = require('assert');

describe('Project List', () => {
  it.only('can load', () => {
    browser.url('/pages/project/list');
    const title = browser.getText('h1');
    assert.equal(title, 'Projects');
  });
});
