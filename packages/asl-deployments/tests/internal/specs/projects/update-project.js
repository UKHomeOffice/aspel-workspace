import assert from 'assert';
import { gotoProjectManagementPage, gotoProjectLandingPage, gotoManageTab } from '../../helpers/project.js';

describe('Project updates', () => {
  describe('Inspector', () => {
    before(async () => {
      await browser.withUser('inspector');
    });

    it('can create a new version of an active project', async () => {
      await gotoProjectManagementPage(browser, 'Internal amendment test');

      assert.ok(browser.$('button=Amend licence').isDisplayed());

      await browser.$('button=Amend licence').click();
      await browser.$('a=Introductory details').click();

      await browser.$('input[name=title]').setValue('Internal amendment new title');

      await browser.$('.control-panel').$('button').click();

      await browser.$('button=Continue').click();

      await browser.waitForSync();

      await browser.$('button=Continue').click();

      assert.equal(await browser.$('h1').getText(), 'Send amendment');

      await browser.$('textarea[name=comments]').setValue('Reason for the change');
      await browser.$('textarea[name=comment]').setValue('Voila, une baguette');
      await browser.$('button*=Submit PPL amendment').click();

      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Project amendment');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');
    });

    describe('Unsubmitted amendments', () => {
      it('cannot start internal amendment on project with unsubmitted external amendment', async () => {
        await gotoProjectLandingPage(browser, 'Unsubmitted amendment');
        assert.ok(browser.$('h3=Amendment in progress').isDisplayed());
        assert.ok(browser.$('p*=This licence cannot be amended because the establishment has initiated').isDisplayed());
        assert.ok(!await browser.$('a=Edit amendment').isDisplayed());

        await gotoManageTab(browser);
        assert.ok(browser.$('h2=Amendment in progress').isDisplayed());
        assert.ok(browser.$('p*=This licence cannot be amended because the establishment has initiated').isDisplayed());
        assert.ok(!await browser.$('button=Edit amendment').isDisplayed());
      });

      it('can continue editing amendment on project with unsubmitted internal amendment', async () => {
        await gotoProjectLandingPage(browser, 'Unsubmitted ASRU amendment');
        assert.ok(browser.$('h3=Amendment in progress').isDisplayed());
        assert.ok(browser.$('p*=An amendment to this licence was started').isDisplayed());
        assert.ok(browser.$('a=Edit amendment').isDisplayed());

        await gotoManageTab(browser);
        assert.ok(browser.$('h2=Amend licence').isDisplayed());
        assert.ok(browser.$('p*=An amendment to this licence was started').isDisplayed());
        assert.ok(browser.$('button=Edit amendment').isDisplayed());
      });
    });

  });
});
