import assert from 'assert';
import { gotoEstablishmentDashboard } from '../../helpers/establishment.js';

describe('Establishment', () => {

  describe('Revoke', () => {

    before(async () => {
      await browser.withUser('inspector');
    });

    it('ASRU user cannot revoke an establishment that has active associated PILs', async () => {
      await gotoEstablishmentDashboard(browser, 'University of Life');
      await browser.$('a=Establishment details').click();
      assert(browser.$('section.revoke-licence').isDisplayed(), 'the revoke licence section should be present');
      assert(browser.$('p*=You can\'t revoke this licence').isDisplayed(), 'an explanation why the licence can\'t be revoked is displayed');
      assert(!await browser.$('a=Revoke licence').isDisplayed(), 'the revoke licence button should not be available');
    });

    it('ASRU user cannot revoke an establishment that has active associated PPLs', async () => {
      await gotoEstablishmentDashboard(browser, 'Small Pharma');
      await browser.$('a=Establishment details').click();
      assert(browser.$('section.revoke-licence').isDisplayed(), 'the revoke licence section should be present');
      assert(browser.$('p*=You can\'t revoke this licence').isDisplayed(), 'an explanation why the licence can\'t be revoked is displayed');
      assert(!await browser.$('a=Revoke licence').isDisplayed(), 'the revoke licence button should not be available');
    });

    it('ASRU user cannot revoke an establishment that has PPLs with additional availability at the establishment', async () => {
      await gotoEstablishmentDashboard(browser, 'Only AA Licences');
      await browser.$('a=Establishment details').click();
      assert(browser.$('section.revoke-licence').isDisplayed(), 'the revoke licence section should be present');
      assert(browser.$('p*=You can\'t revoke this licence').isDisplayed(), 'an explanation why the licence can\'t be revoked is displayed');
      assert(!await browser.$('a=Revoke licence').isDisplayed(), 'the revoke licence button should not be available');
    });

    it('ASRU user can revoke an establishment that has no associated active licences', async () => {
      await gotoEstablishmentDashboard(browser, 'No Licences');
      await browser.$('a=Establishment details').click();
      assert(browser.$('section.revoke-licence').isDisplayed(), 'the revoke licence section should be present');
      assert(browser.$('a=Revoke licence').isDisplayed(), 'the revoke licence button should be available');

      await browser.$('a=Revoke licence').click();
      await browser.$('textarea[name=comments]').setValue('Testing licence revocation');
      await browser.$('button=Continue').click();

      assert(browser.$('p=Testing licence revocation').isDisplayed(), 'the "Why are you revoking this licence?" answer should be visible on the confirm page');

      await browser.$('button=Submit').click();
      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Establishment revocation');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Revoked');

      await browser.url('/');
      await browser.$('a=Establishments').click();
      await browser.$('a=Revoked').click();
      await browser.$('table:not(.loading)').waitForExist();
      assert(browser.$('a=No Licences').isDisplayed(), 'the establishment is listed under the revoked filter');

      await browser.$('a=No Licences').click();
      assert(browser.$('.licence-status-banner.revoked').isDisplayed(), 'the establishment dashboard should display a revoked status banner');
    });

  });

});
