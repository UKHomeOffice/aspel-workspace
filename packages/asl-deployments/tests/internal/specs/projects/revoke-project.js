import assert from 'assert';
import { gotoProjectLandingPage, gotoProjectManagementPage } from '../../helpers/project.js';

describe('Revoke project', () => {
  before(async () => {
    await browser.withUser('inspector');
  });

  it('does not give the option to revoke a draft project', async () => {
    await gotoProjectManagementPage(browser, 'Submitted draft');
    assert(!await browser.$('a=Revoke licence').isDisplayed(), 'there should not be a revoke button on draft projects');
  });

  it('does not give the option to revoke an expired project', async () => {
    await gotoProjectManagementPage(browser, 'Search for the luminescent aether');
    assert(!await browser.$('a=Revoke licence').isDisplayed(), 'there should not be a revoke button on expired projects');
  });

  it('does not give the option to revoke a revoked project', async () => {
    await gotoProjectManagementPage(browser, 'Revoked project');
    assert(!await browser.$('a=Revoke licence').isDisplayed(), 'there should not be a revoke button on revoked projects');
  });

  it('does not give the option to revoke a project with an open task (e.g. amendment in progress)', async () => {
    await gotoProjectManagementPage(browser, 'Amend in prog project');
    assert(!await browser.$('a=Revoke licence').isDisplayed(), 'there should not be a revoke button on projects with an open task');
  });

  it('an inspector can immediately revoke an active project', async () => {
    await browser.withUser('inspector');

    await gotoProjectManagementPage(browser, 'Internal Revoke Test');

    await browser.$('a=Revoke licence').click();
    await browser.$('textarea[name=comments]').setValue('Testing Licensing revocation');
    await browser.$('button=Continue').click();

    assert(browser.$('p=Testing Licensing revocation').isDisplayed(), 'the "Why are you revoking this licence?" answer should be visible on the confirm page');

    await browser.$('button=Submit').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project revocation');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Revoked');

    await gotoProjectLandingPage(browser, 'Internal Revoke Test');
    const text = await browser.$('.licence-status-banner .status').getText();
    assert.equal(text, 'REVOKED');
    assert.ok(browser.$('.licence-status-banner.revoked').isDisplayed(), 'Status banner has "revoked" class');

    // we can't currently undo a revocation yet so you will need to re-run the seeds if running this test locally
  });

});
