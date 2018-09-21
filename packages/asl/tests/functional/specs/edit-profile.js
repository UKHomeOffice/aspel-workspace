const assert = require('assert');

describe('Smoke tests', () => {

  it('can access profile edit form', () => {

    browser.withUser('holc');
    browser
      .$('header .status-bar')
      .$('a=Leonard Martin')
      .click();
    browser
      .$('a=Edit your details')
      .click();

    browser.setValue('input[name=firstName]', 'Leonardo');
    browser.$('button*=Submit').click();

    let notification = browser.$('#notification-summary-heading').getText();
    assert.equal(notification, 'Profile edited');

    let name = browser.getText('header .status-bar a');
    assert.equal(name[0], 'Leonardo Martin');

    browser.setValue('input[name=firstName]', 'Leonard');
    browser.$('button*=Submit').click();

    notification = browser.$('#notification-summary-heading').getText();
    assert.equal(notification, 'Profile edited');

    name = browser.getText('header .status-bar a');
    assert.equal(name[0], 'Leonard Martin');

  });

});
