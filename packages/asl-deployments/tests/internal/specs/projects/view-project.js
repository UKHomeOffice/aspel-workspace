import assert from 'assert';
import { gotoProjectLandingPage, gotoProjectSearch } from '../../helpers/project.js';

describe('View project', () => {
  before(async () => {
    await browser.withUser('inspector');
  });

  it('ASRU user can view project', async () => {
    await gotoProjectLandingPage(browser, 'Internal View Test');
    await browser.$('=View licence').click();
    assert.ok(browser.$('.document-header').$('h2=Internal View Test').isDisplayed(), 'Project title should appear in header');
  });

  it('hides unsubmitted drafts in project search', async () => {

    await gotoProjectSearch(browser);
    await browser.$('.search-box input[type="text"]').setValue('unsubmitted draft');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(!await browser.$('a=Unsubmitted draft').isDisplayed(), 'Unsubmitted draft should not show in search results');

  });

  it('show submitted drafts in project search', async () => {

    await gotoProjectSearch(browser);
    await browser.$('.search-box input[type="text"]').setValue('submitted draft');
    await browser.$('.search-box button').click();
    await browser.$('table:not(.loading)').waitForExist();

    assert.ok(browser.$('a=Submitted draft').isDisplayed(), 'Submitted draft should show in search results');

  });

  it('should display correct establishment details on legacy projects', async () => {
    await gotoProjectLandingPage(browser, 'Legacy project');
    await browser.$('=View licence').click();
    await browser.$('a=Establishments').click();

    assert.ok(browser.$('p=University of Croydon').isDisplayed(), 'Establishment name should be visible');
    assert.ok(!await browser.$('p*=transfer').isDisplayed(), 'No transfer related content should be visible');
  });

  it('should provide a licence download link for legacy projects', async () => {
    await gotoProjectLandingPage(browser, 'Legacy project');
    await browser.$('=View licence').click();
    await browser.$('a=View details and downloads').click();

    assert.ok(browser.$('.document-header').$('a=Download licence (PDF)').isDisplayed());
  });

  it('asru users without revoke or manage access perms should not see the manage tab', async () => {
    await browser.withUser('licensing');
    await gotoProjectLandingPage(browser, 'Basic user project');
    assert.ok(!await browser.$('.govuk-tabs').$('a*=Manage').isDisplayed(), 'the manage tab should be hidden from licensing officers');
  });

  it('asru users with revoke or manage access perms should see the manage tab', async () => {
    await browser.withUser('asrusuper');
    await gotoProjectLandingPage(browser, 'Basic user project');
    assert.ok(browser.$('.govuk-tabs').$('a*=Manage').isDisplayed(), 'the manage tab should be visible to asrusuper');
  });

});
