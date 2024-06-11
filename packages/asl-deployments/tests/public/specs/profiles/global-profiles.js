import assert from 'assert';
const HOLC_ID = '5b7bad13-f34b-4959-bd08-c6067ae2fcdd';
const NTCO_ID = '0b2d1c52-f8e4-4d16-b58c-0ce80ca58d0c';
const INSPECTOR_ID = 'a942ffc7-e7ca-4d76-a001-0b5048a057d1';
const LICENSING_ID = 'a942ffc7-e7ca-4d76-a001-0b5048a057d2';
const ASRU_ADMIN_ID = 'a8e6f04b-f3a6-4378-91fa-f612d4ed1102';

describe('Global profile', () => {
  it('can view own global profile', async() => {
    await browser.withUser('holc');
    await browser.url(`/profile/${HOLC_ID}`);
    assert.ok(await browser.$('a[href="/account/update-email"]').isDisplayed(), 'Link to edit email displayed');
    assert.ok(await browser.$('a[href="/account/edit"]').isDisplayed(), 'Link to edit account displayed');
    assert.ok(!await browser.$('h2=ASRU').isDisplayed(), 'ASRU panel not displayed');
    assert.ok(await browser.$('h2=Related tasks').isDisplayed(), 'Related tasks are displayed.');
  });

  it('cannot view another establishment users global profile', async() => {
    await browser.withUser('holc');
    await browser.url(`/profile/${NTCO_ID}`);
    assert.equal(await browser.$('h1').getText(), 'Page not found');
  });

  it('can view an inspectors profile', async() => {
    await browser.withUser('holc');
    await browser.url(`/profile/${INSPECTOR_ID}`);
    assert.ok(await browser.$('li=Inspector').isDisplayed());
    assert.ok(!await browser.$('a[href*="mailto:"]').isDisplayed(), 'Inspector email is not displayed.');
    assert.ok(!await browser.$('table.tasklist').isDisplayed(), 'Related tasks are not displayed.');
  });

  it('can view a licensing officers profile', async() => {
    await browser.withUser('holc');
    await browser.url(`/profile/${LICENSING_ID}`);
    assert.ok(await browser.$('li=Licensing officer').isDisplayed());
    assert.ok(await browser.$('a=asru-licensing@homeoffice.gov.uk').isDisplayed(), 'Licensing email is displayed.');
    assert.ok(!await browser.$('table.tasklist').isDisplayed(), 'Related tasks are not displayed.');
  });

  it('can view an ASRU admin profile', async() => {
    await browser.withUser('holc');
    await browser.url(`/profile/${ASRU_ADMIN_ID}`);
    assert.ok(!await browser.$('li=User admin').isDisplayed(), 'External user cannot see the asru admin role');
    assert.ok(!await browser.$('table.tasklist').isDisplayed(), 'Related tasks are not displayed.');
  });
});
