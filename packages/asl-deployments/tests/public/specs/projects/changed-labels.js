import assert from 'assert';

import { gotoProjectManagementPage, discardAmendment } from '../../helpers/project.js';

const changedBadgeDisplayedAtSection = async (section) => {
  const isDisplayed = await browser.$(`//a[text()="${section}"]/ancestor::tr/td[@class="controls"]/*[@class="badge changed"]`).isDisplayed();
  return isDisplayed;
};

describe('Project changed labels', () => {

  before(async() => {
    await browser.withUser('holc');
  });

  describe('standard projects', () => {
    beforeEach(async() => {
      await gotoProjectManagementPage(browser, 'Project with protocols');
      await browser.$('button=Amend licence').click();
    });

    afterEach(async() => {
      await browser.waitForSync();
      await discardAmendment(browser, 'Project with protocols');
    });

    it('displays on changed sections', async() => {
      await browser.$('a=Introductory details').click();

      await browser.$('input[name=title]').setValue('New title');

      await browser.$('button=Continue').click();
      await browser.$('=List of sections').click();

      assert.ok(await browser.$('tr*=Introductory details').$('.badge.changed').isDisplayed(), 'Changed label should appear in introductory details');
      await browser.waitForSync();
      await browser.refresh();
      assert.ok(await browser.$('tr*=Introductory details').$('.badge.changed').isDisplayed(), 'Changed label should appear in introductory details');
    });

    it('displays on changed steps', async() => {
      await browser.$('a=Protocols').click();
      await browser.$('h2*=New protocol 2').click();

      await browser.$$('.protocol')[1].$('h3*=Steps').click();
      await browser.$('.expanding-panel.steps.open').waitForDisplayed();
      await browser.$$('.protocol')[1].$$('section.step')[1].$('=Edit step').click();

      await browser.$$('.protocol')[1].$('input[type=radio][name*=optional][value=false]').click();

      await browser.$$('.protocol')[1].$('button=Save step').click();

      assert.equal(await browser.$$('.protocol')[1].$$('section.step')[1].$$('.badge.changed').length, 2);
      await browser.waitForSync();
      await browser.refresh();
      await browser.$('h2*=New protocol 2').click();
      await browser.$$('.protocol')[1].$('h3*=Steps').click();
      await browser.$('.expanding-panel.steps.open').waitForDisplayed();
      assert.equal(await browser.$$('.protocol')[1].$$('section.step')[1].$$('.badge.changed').length, 2);
    });

    it('displays only on changed protocol', async() => {
      await browser.$('a=Protocols').click();
      await browser.$('h2*=New protocol 2').click();

      await browser.$$('.protocol')[1].$('label=Moderate').click();

      assert.ok(!await browser.$$('.protocol')[0].$('.badge.changed').isDisplayed(), 'Changed label should not appear on first protocol');
      assert.ok(await browser.$$('.protocol')[1].$('.badge.changed').isDisplayed(), 'Changed label should appear on second protocol');
      await browser.waitForSync();
      await browser.refresh();
      assert.ok(!await browser.$$('.protocol')[0].$('.badge.changed').isDisplayed(), 'Changed label should not appear on first protocol');
      assert.ok(await browser.$$('.protocol')[1].$('.badge.changed').isDisplayed(), 'Changed label should appear on second protocol');
    });

    it('shows changes to protocols when adding a protocol', async() => {
      await browser.$('a=Protocols').click();
      await browser.$('button=Add another protocol').click();
      await browser.$('input[name*=".title"]').setValue('New protocol');

      await browser.$('=List of sections').doubleClick();

      assert.ok(await browser.$('tr*=Protocols').$('.badge.changed').isDisplayed(), 'Changed label should appear in Protocols section');
      await browser.waitForSync();
      await browser.refresh();
      assert.ok(await browser.$('tr*=Protocols').$('.badge.changed').isDisplayed(), 'Changed label should appear in Protocols section');
    });
  });

  describe('legacy projects', () => {
    beforeEach(async() => {
      await gotoProjectManagementPage(browser, 'Legacy project');
      await browser.$('button=Amend licence').click();
    });

    afterEach(async() => {
      await browser.waitForSync();
      await discardAmendment(browser, 'Legacy project');
    });

    it('adding AA does not show protocols as changed', async() => {
      await browser.$('a=Establishments').click();
      await browser.$('input[type=radio][name=other-establishments][value=true]').click();
      await browser.$('button=Continue').click();

      await browser.$('[name*="establishment-about"]').completeRichText('Adding AA to legacy licence');
      await browser.waitForSync();

      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();

      assert.ok(await changedBadgeDisplayedAtSection('Establishments'), 'there should be a changed badge on establishments section');
      assert.ok(!await changedBadgeDisplayedAtSection('Protocols'), 'there should not be a changed badge on protocols section');
      await browser.waitForSync();
      await browser.refresh();
      assert.ok(await changedBadgeDisplayedAtSection('Establishments'), 'there should be a changed badge on establishments section');
      assert.ok(!await changedBadgeDisplayedAtSection('Protocols'), 'there should not be a changed badge on protocols section');
    });

    it('adding a POLE does not show protocols as changed', async() => {
      await browser.$('a*=(POLES)').click();

      await browser.$('[name="poles-list"]').completeRichText('This is a new POLE');
      await browser.waitForSync();

      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();

      assert.ok(await changedBadgeDisplayedAtSection('Places other than a licensed establishment (POLES)'), 'there should be a changed badge on POLES section');
      assert.ok(!await changedBadgeDisplayedAtSection('Protocols'), 'there should not be a changed badge on protocols section');
      await browser.waitForSync();
      await browser.refresh();
      assert.ok(await changedBadgeDisplayedAtSection('Places other than a licensed establishment (POLES)'), 'there should be a changed badge on POLES section');
      assert.ok(!await changedBadgeDisplayedAtSection('Protocols'), 'there should not be a changed badge on protocols section');
    });
  });

});
