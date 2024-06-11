import assert from 'assert';
import { gotoProjectLandingPage } from '../../helpers/project.js';

describe('Suspended establishment banner on project', () => {
  before(async () => {
    await browser.withUser('holc');
  });

  describe('Primary establishment suspended', () => {
    it('appears when user can see establishment', async () => {
      await gotoProjectLandingPage(browser, 'Suspended Primary Establishment', 'Active', 'Marvell Pharmaceutical');
      await browser.$('.licence-status-banner .toggle-switch').click();
      assert.ok(await browser.$('.status').$('span=Related establishment licence suspended').isDisplayed());
      const statusDetails = await browser.$('.status-details');
      assert.ok(await statusDetails.$(`span*=Suspended Establishment's establishment licence is not active`).isDisplayed());
      assert.strictEqual(await statusDetails.$('li*=Suspended').$('.date').getText(), '01 November 2022', 'the suspension date should be 01 November 2022');
    });

    it('does not appear when user cannot see establishment', async () => {
      await gotoProjectLandingPage(browser, 'Suspended Primary Establishment - no permission', 'Active', 'Marvell Pharmaceutical');
      assert.ok(!await browser.$('.licence-status-banner').isDisplayed());
    });
  });

  describe('Additional establishment suspended', () => {
    it('appears when user can see establishment', async () => {
      await gotoProjectLandingPage(browser, 'Suspended Additional Establishment', 'Active', 'Marvell Pharmaceutical');

      await browser.$('.licence-status-banner .toggle-switch').click();
      assert.ok(await browser.$('.status').$('span=Related establishment licence suspended').isDisplayed());
      const statusDetails = await browser.$('.status-details');
      assert.ok(await statusDetails.$(`span*=Suspended Establishment's establishment licence is not active`).isDisplayed());
      assert.strictEqual(await statusDetails.$('li*=Suspended').$('.date').getText(), '01 November 2022', 'the suspension date should be 01 November 2022');
    });

    it('does not appear when user cannot see establishment', async () => {
      await gotoProjectLandingPage(browser, 'Suspended Additional Establishment - no permission', 'Active', 'Marvell Pharmaceutical');
      assert.ok(!await browser.$('.licence-status-banner').isDisplayed());
    });
  });
});
