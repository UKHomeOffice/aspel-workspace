import assert from 'assert';
import { gotoProfilePage } from '../../helpers/profile.js';

describe('View profile', () => {
  before(async () => {
    await browser.withUser('inspector');
  });

  it('hides unsubmitted project drafts', async () => {

    await gotoProfilePage(browser, 'Imojean Addlestone');
    await browser.$('h3=University of Croydon').click();
    await browser.$('.expanding-panel.open').$('a=Drafts').click();
    assert.ok(!await browser.$('a=Unsubmitted draft').isDisplayed(), 'Unsubmitted draft should not show');

  });

  it('show submitted project drafts', async () => {

    await gotoProfilePage(browser, 'Imojean Addlestone');
    await browser.$('h3=University of Croydon').click();
    await browser.$('.expanding-panel.open').$('a=Drafts').click();
    assert.ok(browser.$('a=Submitted draft').isDisplayed(), 'Submitted draft should show');

  });

});
