const assert = require('assert');

describe('Establishment Details Page', () => {

  it('collapsible content is collapsed by default', () => {
    browser.url('/pages/details');
    const visible = browser.isVisible('.expanding-panel .content');
    // force to an array because browser.isVisible can return single value *or* an array depending on state
    [].concat(visible).forEach(v => {
      assert.equal(v, false);
    });
  });

});
