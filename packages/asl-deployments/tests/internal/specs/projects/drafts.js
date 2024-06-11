import assert from 'assert';
import { gotoEstablishmentDashboard } from '../../helpers/establishment.js';

describe('Establishment project list', () => {
  before(async () => {
    await browser.withUser('inspector');
  });

  it('hides unsubmitted drafts in project list', async () => {
    await gotoEstablishmentDashboard(browser, 'University of Croydon');
    await browser.$('a=Projects').click();
    await browser.$('a=Drafts').click();
    await browser.$('.search-box input[type="text"]').setValue('unsubmitted draft');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(!await browser.$('a=Unsubmitted draft').isDisplayed(), 'Unsubmitted draft should not show in project list');
  });

  it('show submitted drafts in project list', async () => {
    await gotoEstablishmentDashboard(browser, 'University of Croydon');
    await browser.$('a=Projects').click();
    await browser.$('a=Drafts').click();
    await browser.$('.search-box input[type="text"]').setValue('submitted draft');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(browser.$('a=Submitted draft').isDisplayed(), 'Submitted draft should show in project list');
  });

});
