import assert from 'assert';
import { gotoProfile } from '../../helpers/profile.js';

describe('View Training', () => {

  describe('as basic user', () => {
    before(async () => {
      await browser.withUser('basic');
    });

    it('basic user should be able to view and manage training from their profile', async () => {
      await gotoProfile(browser, 'Basic User');
      await assert.ok(browser.$('h3=Training record').isDisplayed());
      await assert.ok(browser.$('a=Manage training').isDisplayed());
    });

    it('basic user should not be able to view and manage training on other profiles', async () => {
      await gotoProfile(browser, 'Bruce Banner');
      assert.ok(!await browser.$('h3=Training record').isDisplayed());
      assert.ok(!await browser.$('a=Manage training').isDisplayed());
    });
  });

  describe('as admin user', () => {
    before(async () => {
      await browser.withUser('holc');
    });

    it('admin user should be able to view and manage training on other profiles', async () => {
      await gotoProfile(browser, 'Basic User');
      await assert.ok(browser.$('h3=Training record').isDisplayed());
      await assert.ok(browser.$('a=Manage training').isDisplayed());
    });
  });

});
