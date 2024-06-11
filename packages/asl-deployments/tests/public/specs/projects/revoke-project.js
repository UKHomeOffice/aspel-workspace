import assert from 'assert';
import { gotoProjectManagementPage, submitAmendment, discardTask } from '../../helpers/project.js';

describe('Revoke project', () => {
  before(async() => {
    await browser.withUser('holc');
  });

  it('does not give the option to revoke a draft project', async() => {
    await gotoProjectManagementPage(browser, 'Draft project', 'Drafts');
    assert(!await browser.$('a=Revoke licence').isDisplayed(), 'there should not be a revoke button on draft projects');
  });

  it('does not give the option to revoke an expired project', async() => {
    await gotoProjectManagementPage(browser, 'Search for the luminescent aether', 'Expired');
    assert(!await browser.$('a=Revoke licence').isDisplayed(), 'there should not be a revoke button on expired projects');
  });

  it('does not give the option to revoke a revoked project', async() => {
    await gotoProjectManagementPage(browser, 'Revoked project', 'Revoked');
    assert(!await browser.$('a=Revoke licence').isDisplayed(), 'there should not be a revoke button on revoked projects');
  });

  it('does not give the option to revoke a project with an open task (e.g. amendment in progress)', async() => {
    const projectTitle = 'Oncolytic HSV as an anti-cancer therapy';
    await gotoProjectManagementPage(browser, projectTitle);

    await browser.$('button=Amend licence').click();
    await browser.$('a=Introductory details').click();
    await browser.$('input[name=title]').setValue(`${projectTitle} 2`);
    await browser.waitForSync();

    await browser.$('.control-panel').$('button=Continue').click();
    await browser.$('button=Continue').click();
    await submitAmendment(browser);

    await gotoProjectManagementPage(browser, projectTitle);
    assert(!await browser.$('a=Revoke licence').isDisplayed(), 'there should not be a revoke button on projects with an open task');

    await discardTask(browser, projectTitle);
  });

  it('a holc can request revocation of an active project', async() => {
    await gotoProjectManagementPage(browser, 'Public Revoke Test');

    await browser.$('a=Revoke licence').click();
    await browser.$('textarea[name=comments]').setValue('Testing HOLC revocation');
    await browser.$('button=Continue').click();

    assert(await browser.$('p=Testing HOLC revocation').isDisplayed(), 'the "Why are you revoking this licence?" answer should be visible on the confirm page');

    await browser.$('button=Submit').click();
    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Project revocation');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

    await gotoProjectManagementPage(browser, 'Public Revoke Test');
    assert(await browser.$('h2=Revocation in progress').isDisplayed(), 'the project landing page should show a revocation in progress');
    assert(!await browser.$('a=Revoke licence').isDisplayed(), 'there should be no revoke button available');

    await discardTask(browser, 'Public Revoke Test');
    await gotoProjectManagementPage(browser, 'Public Revoke Test');
    assert(await browser.$('a=Revoke licence').isDisplayed(), 'if a revoke task is withdrawn, the user should be able to revoke again');
  });

});
