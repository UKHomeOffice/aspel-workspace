import assert from 'assert';
import { gotoProfile } from '../../helpers/profile.js';

describe('PIL Review', () => {
  it('shows a review due banner on the PIL page if a PIL review is due', async () => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Due PIL Review');
    await browser.$('a[href*="/pil/"]').click();
    assert.ok(await browser.$('strong=This personal licence is due a 5 year review').isDisplayed());
  });

  it('shows an overdue banner on the PIL page if a PIL review is overdue', async () => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Overdue PIL Review');
    await browser.$('a[href*="/pil/"]').click();
    assert.ok(await browser.$('strong=This personal licence is overdue a 5 year review').isDisplayed());
  });

  it('does not show a banner on the PIL page if a PIL is revoked', async () => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Revoked PIL Review');
    await browser.$('a[href*="/pil/"]').click();
    assert.ok(!await browser.$('.pil-review').isDisplayed());
  });

  it('can submit a PIL review to the NTCO, which can be endorsed', async () => {
    await browser.withUser('holc');
    await gotoProfile(browser, 'Due PIL Review');
    await browser.$('a[href*="/pil/"]').click();
    await browser.$('a=confirmed as up to date and in use').click();
    await browser.$('textarea[name="comments"]').setValue('Some comments here');
    await browser.$('button=Submit confirmation').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence review');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await browser.withUser('ntco');
    await browser.$('a=PIL review').click();

    assert.ok(await browser.$('p=Some comments here').isDisplayed());
    assert.ok(!await browser.$('.procedures-diff ul.current').isDisplayed(), 'there should be no "current" list of procedures');
    assert.ok(!await browser.$('.procedures-diff ul.proposed').isDisplayed(), 'there should be no "proposed" list of procedures');
    assert.equal(await browser.$$('.procedures-diff li').length, 1, 'there should be one procedure displayed');
    assert.ok(await browser.$('.procedures-diff').$('li*=C. Surgical procedures involving general anaesthesia.').isDisplayed(), 'it should display the correct procedure');

    assert.ok(!await browser.$('.species-diff ul.current').isDisplayed(), 'there should be no "current" list of species');
    assert.ok(!await browser.$('.species-diff ul.proposed').isDisplayed(), 'there should be no "proposed" list of species');
    assert.equal(await browser.$$('.species-diff li').length, 1, 'there should be one species displayed');
    assert.ok(await browser.$('.species-diff').$('li=Gerbils').isDisplayed(), 'it should display the correct species');

    await browser.$('label=Endorse licence').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Endorse licence').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence review');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Complete');

    await browser.withUser('holc');
    await gotoProfile(browser, 'Due PIL Review');

    assert.ok(!await browser.$('strong=This personal licence is due a 5 year review').isDisplayed());
  });

  it('can review a PIL if user is NTCO', async () => {
    await browser.withUser('ntco');
    await gotoProfile(browser, 'Overdue PIL Review');
    await browser.$('a[href*="/pil/"]').click();
    await browser.$('a=confirmed as up to date and in use').click();
    await browser.$('textarea[name="comments"]').setValue('Some comments here');
    await browser.$('button=Endorse licence').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence review');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Complete');

    await browser.url('/');
    await gotoProfile(browser, 'Due PIL Review');

    assert.ok(!await browser.$('strong=This personal licence is overdue a 5 year review').isDisplayed());
  });
});
