import assert from 'assert';
import {
  gotoProjectManagementPage,
  gotoProjectLandingPage,
  completeAwerb,
  discardTask,
  discardAmendment,
  gotoManageTab
} from '../../helpers/project.js';

describe('Amend project', () => {
  before(async() => {
    await browser.withUser('holc');
  });

  beforeEach(async() => {
    await browser.url('/');
  });

  it('can submit update to basic user project', async() => {
    await gotoProjectManagementPage(browser, 'Basic user project');

    await browser.$('button=Amend licence').click();
    await browser.$('a=Introductory details').click();

    await browser.$('input[name=title]').setValue('Basic user project new title');

    // continue form page - specify the continue button _not_ in the NTS panel
    await browser.$('.control-panel').$('button=Continue').click();
    // continue the review page
    await browser.$('button=Continue').click();

    await browser.$('a=Training').click();

    await browser.$('label[for*="training-complete-false"]').click();
    await browser.waitForSync();
    await browser.$('button=Continue').click();

    // dynamic link to continue PIL journey
    await browser.$('a=Basic user project').click();

    await browser.$('label[for*="training-complete-true"]').click();
    await browser.$('button=Continue').click();

    await browser.waitForSync();

    // continue to submit amendment
    await browser.$('button=Continue').click();

    assert.equal(await browser.$('h1').getText(), 'Send amendment');
    assert.equal(await browser.$('h2').getText(), 'Basic user project');

    await completeAwerb(browser);

    await browser.$('textarea[name=comments]').setValue('Reason for the change');
    await browser.$('button*=Submit PPL amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await discardTask(browser, 'Basic user project');
  });

  it('throws a validation error if comments are missing', async() => {
    await gotoProjectManagementPage(browser, 'Basic user project');

    await browser.$('button=Amend licence').click();

    await browser.$('button=Continue').click();
    assert.equal(await browser.$('h1').getText(), 'Send amendment');

    await completeAwerb(browser);

    await browser.$('button*=Submit PPL amendment').click();

    const error = await browser.$('.govuk-error-summary a').getText();
    assert.equal(error, 'Please provide a reason');

    await discardAmendment(browser, 'Basic user project');
  });

  it('removes the draft version(s) if the task is discarded', async() => {
    await gotoProjectManagementPage(browser, 'Basic user project');

    await browser.$('button=Amend licence').click();
    await browser.$('button=Continue').click();

    await completeAwerb(browser);

    await browser.$('textarea[name=comments]').setValue('Reason for the change');

    await browser.$('button*=Submit PPL amendment').click();

    await gotoProjectManagementPage(browser, 'Basic user project');

    await browser.$('a=View task').click();
    await browser.$('label=Discard amendment').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Discard amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Discarded');

    await gotoProjectManagementPage(browser, 'Basic user project');

    assert.ok(await browser.$('button=Amend licence').isDisplayed());
  });

  it('can update the project, submit, recall, then edit and resubmit', async() => {
    await gotoProjectManagementPage(browser, 'Basic user project');

    await browser.$('button=Amend licence').click();
    await browser.$('button=Continue').click();

    await completeAwerb(browser);

    await browser.$('textarea[name=comments]').setValue('Reason for the change');
    await browser.$('button*=Submit PPL amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await gotoProjectManagementPage(browser, 'Basic user project');

    await browser.$('a=View task').click();
    await browser.$('label=Recall amendment').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Recall amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Recalled');

    await browser.$('a=View task').click();
    await browser.$('label=Edit and resubmit the amendment').click();
    await browser.$('button=Continue').click();

    assert.ok(await browser.$('.document-header').$('h2=Basic user project').isDisplayed());

    await browser.$('button=Continue').click();
    await browser.$('textarea[name=comments]').setValue('Reason for the change');
    await browser.$('button*=Submit PPL amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await gotoProjectManagementPage(browser, 'Basic user project');

    await browser.$('a=View task').click();
    await browser.$('label=Discard amendment').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Discard amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Discarded');

    await gotoProjectManagementPage(browser, 'Basic user project');

    assert.ok(await browser.$('button=Amend licence').isDisplayed());
  });

  it('can update licence holder, and update the task', async() => {
    await gotoProjectManagementPage(browser, 'Basic user project');

    await browser.$('a=change licence holder only').click();
    await browser.browserAutocomplete('licenceHolderId', 'Dagny Aberkirder');
    await browser.$('button=Continue').click();

    await browser.$('button=Continue').click();
    await completeAwerb(browser);

    await browser.$('button*=Submit').click();

    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project licence amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await gotoProjectManagementPage(browser, 'Basic user project');

    await browser.$('a=View task').click();
    await browser.$('label=Recall amendment').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Recall amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project licence amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Recalled');

    await gotoProjectManagementPage(browser, 'Basic user project');

    await browser.$('a=View task').click();
    await browser.$('label=Edit and resubmit the amendment').click();
    await browser.$('button=Continue').click();
    await browser.browserAutocomplete('licenceHolderId', 'Evvy Addams');
    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    await browser.$('button*=Submit').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project licence amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await gotoProjectManagementPage(browser, 'Basic user project');

    await browser.$('a=View task').click();

    assert.ok(await browser.$('a=Evvy Addams').isDisplayed());

    await browser.$('label=Discard amendment').click();
    await browser.$('button=Continue').click();
    await browser.$('button=Discard amendment').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project licence amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Discarded');

    await gotoProjectManagementPage(browser, 'Basic user project');

    assert.ok(await browser.$('a=change licence holder only').isDisplayed());
  });

  describe('Unsubmitted amendments', () => {
    it('cannot start external amendment on project with unsubmitted internal amendment', async() => {
      await gotoProjectLandingPage(browser, 'Unsubmitted ASRU amendment');
      assert.ok(await browser.$('h3=Amendment in progress').isDisplayed());
      assert.ok(await browser.$('p*=The Home Office has initiated an amendment').isDisplayed());
      assert.ok(!await browser.$('a=Edit amendment').isDisplayed());

      await gotoManageTab(browser);
      assert.ok(await browser.$('h2=Amendment in progress').isDisplayed());
      assert.ok(await browser.$('p*=The Home Office has initiated an amendment').isDisplayed());
      assert.ok(!await browser.$('button=Edit amendment').isDisplayed());
    });

    it('can continue editing amendment on project with unsubmitted external amendment', async() => {
      await gotoProjectLandingPage(browser, 'Unsubmitted amendment');
      assert.ok(await browser.$('h3=Amendment in progress').isDisplayed());
      assert.ok(await browser.$('p*=An amendment to this licence was started').isDisplayed());
      assert.ok(await browser.$('a=Edit amendment').isDisplayed());

      await gotoManageTab(browser);
      assert.ok(await browser.$('h2=Amend licence').isDisplayed());
      assert.ok(await browser.$('p*=An amendment to this licence was started').isDisplayed());
      assert.ok(await browser.$('button=Edit amendment').isDisplayed());
    });
  });

  describe('Amend legacy project as basic user', () => {
    it('AWERB data is captured for legacy amendments submitted by a basic user', async() => {
      await browser.withUser('basic');
      await gotoProjectManagementPage(browser, 'Legacy AWERB test');

      await browser.$('button=Amend licence').click();
      await browser.$('a=Introductory details').click();
      await browser.$('input[name=title]').setValue('Legacy AWERB test amended');
      await browser.$('.control-panel').$('button=Continue').click();

      // continue the review page
      await browser.$('button=Continue').click();

      await browser.waitForSync();
      // continue to submit amendment
      await browser.$('button=Continue').click();

      await browser.$('textarea[name=comments]').setValue('Testing Legacy AWERB');
      await browser.$('button*=Submit PPL amendment').click();
      await browser.waitForSuccess();

      await browser.withUser('holc');
      await browser.$('[title="Legacy AWERB test"] a').click();
      await browser.$('label=Endorse amendment').click();
      await browser.$('button=Continue').click();

      await browser.$('input[name="awerb-exempt"][value="false"]').click();
      await browser.$('textarea[name=awerb-review-date]').setValue('AWERB review at Croydon on 21/06/2021');
      await browser.$('button=Endorse amendment').click();

      await browser.$('a=track the progress of this request.').click();

      assert.ok(await browser.$('.activity-log').$('dd=AWERB review at Croydon on 21/06/2021').isDisplayed(), 'the legacy AWERB date should be visible in the task activity log');
      assert.ok(!await browser.$('dd=Invalid Date').isDisplayed(), 'there should be no invalid AWERB dates');

      await discardAmendment(browser, 'Legacy AWERB test');
    });
  });
});
