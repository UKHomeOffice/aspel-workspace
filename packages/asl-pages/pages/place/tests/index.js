const assert = require('assert');

describe('Place', () => {

  it('can load', () => {
    browser.url('/pages/place');
    const title = browser.getText('h1');
    assert.equal(title, 'Licensed premises');
  });

  it('loads the licenced premises', () => {
    browser.url('/pages/place');
    const name = browser.getText('h2');
    assert.equal(name, '1st Floor 20.15')
  })

  describe('/edit', () => {
    it('can load', () => {
      browser.url('/pages/place/edit');
      const title = browser.getText('h1');
      assert.equal(title, 'Change licensed premises');
    });
  });

  describe('/edit/confirm', () => {
    it('redirects you back to the edit page if session data not set', () => {
      browser.url('/pages/place/edit/confirm');
      const title = browser.getText('h1');
      const url = browser.getUrl();
      assert.equal(title, 'Change licensed premises');
      assert.ok(url.match(/pages\/place\/edit$/));
    });
  });

  describe('/edit/success', () => {
    it('can load', () => {
      browser.url('/pages/place/edit/success');
      const title = browser.getText('h1');
      assert.equal(title, 'Your changes have been submitted');
    });
  });
});
