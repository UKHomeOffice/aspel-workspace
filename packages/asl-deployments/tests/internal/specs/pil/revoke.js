import assert from 'assert';
import { gotoProfilePage } from '../../helpers/profile.js';

describe('ASRU user revoking PIL', () => {

  it('inspector can revoke a PIL', async () => {
    await browser.withUser('inspector');

    await gotoProfilePage(browser, 'Phil Revocation');

    await browser.$('a[href*="/pil/"]').click();
    await browser.$('a=Revoke licence').click();

    await browser.$('textarea[name="comments"]').setValue('Reasons for revocation');

    await browser.$('button=Continue').click();
    await browser.$('button=Submit').click();

    await browser.waitForSuccess();
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Revoked');

    await gotoProfilePage(browser, 'Phil Revocation');
    await browser.$('a[href*="/pil/"]').click();

    assert.ok(browser.$('.licence-status-banner.revoked').isDisplayed());
  });

  it('PIL revocation task remains visible if user is removed from establishment', async () => {
    await browser.withUser('inspector');

    await gotoProfilePage(browser, 'Phil Revocation');

    await browser.$('a=Change / remove').click();
    await browser.$('a=Remove').click();
    await browser.$('button=I understand, remove now').click();

    await gotoProfilePage(browser, 'Phil Revocation');

    await browser.$('.tasklist').$('a=PIL revocation').click();

    assert.ok(browser.$('h1=Personal licence revocation').isDisplayed());
  });

});
