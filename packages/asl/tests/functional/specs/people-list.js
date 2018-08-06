const assert = require('assert');

describe('People directory', () => {

  it('will filter to a particular role', () => {
    browser.withUser('holc');
    browser.click('a[href*="/people"]');

    browser.$('.link-filter').$('a=NACWO').click();

    browser.waitForExist('table:not(.loading)');

    const roles = browser.$$('tbody tr td:nth-child(2)')
      .map(td => browser.elementIdText(td.ELEMENT).value);

    roles.forEach(role => assert.ok(role.includes('NACWO')));
  });

  it('will filter on the name', () => {
    browser.withUser('holc');
    browser.click('a[href*="/people"]');

    browser.$('.search-box input[type="text"]').setValue('Laur');
    browser.$('.search-box button').click();

    browser.waitForExist('table:not(.loading)');

    const names = browser.$$('tbody tr td:nth-child(1)')
      .map(td => browser.elementIdText(td.ELEMENT).value);

    names.forEach(name => assert.ok(name.includes('Laur')));
  });

  it('will filter to a particular role and name', () => {
    browser.withUser('holc');
    browser.click('a[href*="/people"]');

    browser.$('.link-filter').$('a=NACWO').click();

    browser.$('.search-box input[type="text"]').setValue('b');
    browser.$('.search-box button').click();

    browser.waitForExist('table:not(.loading)');

    const roles = browser.$$('tbody tr td:nth-child(2)')
      .map(td => browser.elementIdText(td.ELEMENT).value);

    const names = browser.$$('tbody tr td:nth-child(1)')
      .map(td => browser.elementIdText(td.ELEMENT).value);

    roles.forEach(role => assert.ok(role.includes('NACWO'), `${role} should contain "NACWO"`));
    names.forEach(name => assert.ok(name.toLowerCase().includes('b'), `${name} should contain "b"`));
  });

});
