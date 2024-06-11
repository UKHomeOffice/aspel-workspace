import assert from 'assert';

import { gotoProfile } from '../../helpers/profile.js';

const LICENCE_NUMBER = 'GV-794484';

describe('PIL Reactivation', () => {

  describe('when revoked PIL is held at another establishment', () => {

    it('can apply for a new PIL at PIL holding establishment if user has permissions there', async () => {
      await browser.withUser('holc');
      await gotoProfile(browser, 'Kirstyn Smallcomb', 'Marvell Pharmaceutical');

      await browser.$('a=SQ-025927').click();
      await browser.$('a=Reapply for licence').click();

      assert.equal(await browser.$('h1').getText(), 'Choose personal licence (PIL) category', 'Category choice screen should be displayed');

      await browser.$('button=Apply now').click();

      assert.match(await browser.$('h2').getText(), /Marvell Pharmaceutical/);
      assert.equal(await browser.$('h1').getText(), 'Apply for personal licence - Categories A, B, C, D and F', 'PIL application screen should be displayed');

      assert.ok(!await browser.$('.section-item.procedures').$('.status-label.completed').isDisplayed(), 'Procedures section is not complete');
      assert.ok(await browser.$('p=No procedures selected.').isDisplayed(), 'No procedure categories should be selected');
      assert.ok(await browser.$('p=No animal types selected.').isDisplayed(), 'No species should be selected');
    });

    describe('and the user is no longer affiliated to the PIL holding establishment', () => {

      it('can apply for a new PIL from the PIL page', async () => {
        await browser.withUser('holc');
        await gotoProfile(browser, 'Fayth Reyna', 'University of Croydon');
        await browser.$('a=PC-818226').click();

        await browser.$('a=Reapply for licence').waitForClickable();
        await browser.$('a=Reapply for licence').click();

        assert.ok(await browser.$('h2=University of Croydon').isDisplayed(), 'New PIL application is for University of Croydon');
        assert.equal(await browser.$('h1').getText(), 'Choose personal licence (PIL) category', 'Category choice screen should be displayed');
      });

    });

  });

  describe('when revoked PIL is held at the same establishment', () => {

    it('can apply for a new PIL', async () => {
      await browser.withUser('holc');
      await gotoProfile(browser, 'Brok Servis', 'University of Croydon');

      await browser.$(`a=${LICENCE_NUMBER}`).click();

      assert.equal(await browser.$('.document-header h1').getText(), 'Personal licence', 'PIL details page should be displayed');
      assert.ok(await browser.$('.licence-status-banner.revoked').isDisplayed(), 'Revoked banner should be displayed');

      assert.ok(await browser.$('a=Reapply for licence').isDisplayed());
      await browser.$('a=Reapply for licence').click();

      assert.equal(await browser.$('h1').getText(), 'Apply for personal licence - Categories A, B, C, D and F', 'PIL application screen should be displayed');

      assert.ok(await browser.$('.section-item.procedures').$('.status-label.completed').isDisplayed(), 'Procedures section is complete');

      const selectedCategories = await browser.$$('li.section-item.procedures ul.current li');
      assert.equal(selectedCategories.length, 2, 'there should be two selected procedure categories');
      const categories0 = await selectedCategories[0].getText();
      const categories1 = await selectedCategories[1].getText();
      assert(categories0.includes('A. Minor / minimally invasive procedures'), 'Procedure category A is selected');
      assert(categories1.includes('B. Minor / minimally invasive procedures'), 'Procedure category B is selected');
    });

  });

});
