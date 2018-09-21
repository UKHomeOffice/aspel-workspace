const assert = require('assert');

describe('Smoke tests', () => {
  it('can log in', () => {
    browser.withUser('holc');
    const title = browser.getTitle();
    assert.equal(title, 'Research and testing with animals');
  });

  // it('is shown a 404 error if the user has no associated establishment', () => {
  //   browser.withUser('inspector');
  //   const title = browser.getText('h1');
  //   assert.equal(title, 'Not found');
  // });

  it('sees establishment list', () => {
    browser.withUser('holc');
    assert.equal(
      browser.getText('=University of Croydon'),
      'University of Croydon'
    );
    assert.equal(
      browser.getText('=Marvell Pharmaceutical'),
      'Marvell Pharmaceutical'
    );
  });

  it('can access establishment dashboard', () => {
    browser.withUser('holc');
    browser.click('a=University of Croydon');
    const title = browser.getText('h1');
    assert.equal(title, 'University of Croydon');
  });

  it('can access invitation page', () => {
    browser.withUser('holc');
    browser.click('a=Invite');
    const title = browser.getText('h1');
    assert.equal(title, 'Invite user');
  });

  it('can access schedule establishment details page', () => {
    browser.withUser('holc');
    browser.click('a=University of Croydon').click('=Establishment details');
    const title = browser.getText('h1');
    assert.equal(title, 'Establishment details');
  });

  it('can access profile page', () => {
    browser.withUser('holc');
    browser
      .click('a=University of Croydon')
      .click('a=Establishment details');
    browser
      .$('main dl')
      .$('a=Leonard Martin')
      .click();
    const title = browser.getText('h1');
    assert.equal(title, 'Leonard Martin');
  });

  it('can access account management page', () => {
    browser.withUser('holc');
    browser
      .$('header .status-bar')
      .$('a=Leonard Martin')
      .click();
    const title = browser.getText('h1');
    assert.equal(title, 'Your account');
  });

  it('can access profile edit form', () => {
    browser.withUser('holc');
    browser
      .$('header .status-bar')
      .$('a=Leonard Martin')
      .click();
    browser
      .$('a=Edit your details')
      .click();
    const title = browser.getText('h1');
    assert.equal(title, 'Edit profile');
  });

  it('can access schedule of premises page', () => {
    browser.withUser('holc');
    browser.click('a=University of Croydon').click('=Licensed premises');
    const title = browser.getText('h1');
    assert.equal(title, 'Licensed premises');
  });

  it('can access people page', () => {
    browser.withUser('holc');
    browser.click('a=University of Croydon').click('=People');
    const title = browser.getText('h1');
    assert.equal(title, 'People');
  });

  it('can access projects page', () => {
    browser.withUser('holc');
    browser.click('a=University of Croydon').click('=Projects');
    const title = browser.getText('h1');
    assert.equal(title, 'Projects');
  });
});
