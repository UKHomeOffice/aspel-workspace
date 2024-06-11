import assert from 'assert';
import { gotoProjectLandingPage, gotoProjectManagementPage } from '../../helpers/project.js';

describe('Project collaborators', () => {
  it('cannot visit the collaborators page if user is not admin or ppl holder', async () => {
    await browser.withUser('read');
    await gotoProjectLandingPage(browser, 'Basic user project');
    assert.ok(!await browser.$('.govuk-tabs').$('a*=Manage').isDisplayed(), 'The project manage tab should not be visible');

    await gotoProjectLandingPage(browser, 'Basic user project');
    const url = await browser.getUrl();
    await browser.url(`${url}/add-user`);
    assert.equal(await browser.$('h1').getText(), 'You do not have permission to access this page');
  });

  it('can visit the collaborators page if user is ppl holder', async () => {
    await browser.withUser('basic');
    await gotoProjectManagementPage(browser, 'Basic user project');
    assert.ok(browser.$('h2=Guest access').isDisplayed());
    await browser.$('a=Grant access').click();
    assert.equal(await browser.$('h1').getText(), 'Grant access');
  });

  it('can add a basic user to a granted project, basic user can now access, admin can remove and access is rescinded.', async () => {
    const PROJECT_TITLE = 'Project with multiple versions';
    await browser.withUser('holc');
    await gotoProjectManagementPage(browser, PROJECT_TITLE);
    await browser.$('a=Grant access').click();
    await browser.browserAutocomplete('profile', 'Basic User');
    await browser.$('button=Submit').click();
    await browser.waitForSuccess();
    assert.ok(browser.$('p=Access granted. Basic User has been notified.').isDisplayed());

    await browser.withUser('basic');
    await gotoProjectLandingPage(browser, PROJECT_TITLE);
    assert.equal(await browser.$('.document-header h2').getText(), PROJECT_TITLE);

    const url = await browser.getUrl();

    await browser.withUser('holc');
    await gotoProjectManagementPage(browser, PROJECT_TITLE);
    await browser.$('a=Grant access').click();
    await browser.$('td=Basic User').$('..').$('button=Remove access').click();
    await browser.waitForSuccess();
    assert.ok(browser.$('p=Basic User has been removed from this project.').isDisplayed());

    await browser.withUser('basic');
    await browser.url(url);
    assert.equal(await browser.$('h1').getText(), 'Page not found');
  });

  describe('collab perms', () => {
    const PROJECT_TITLE = 'Collaborator active project';

    it('can view an active project and not edit with read only perms', async () => {
      await browser.withUser('collabread');
      await gotoProjectLandingPage(browser, PROJECT_TITLE);
      assert.ok(!await browser.$('a=Manage licence').isDisplayed());
    });

    it('can edit an active project with edit perms', async () => {
      await browser.withUser('collabedit');
      await gotoProjectLandingPage(browser, PROJECT_TITLE);
      assert.ok(browser.$('a=Manage licence').isDisplayed());
      await browser.$('a=Manage licence').click();
      await browser.$('button=Amend licence').click();
      await browser.$('a=Introductory details').click();

      await browser.$('input[name="title"]').setValue(`${PROJECT_TITLE} - updated`);
      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();
      await browser.waitForSync();

      assert.ok(browser.$('p=Only the licence holder or an admin can submit this to the Home Office').isDisplayed());
      assert.ok(!await browser.$('button=Continue').isDisplayed());

      await browser.withUser('holc');
      await gotoProjectManagementPage(browser, PROJECT_TITLE);
      await browser.$('button=Edit amendment').click();
      await browser.$('a=Introductory details').click();

      assert.equal(await browser.$('input[name="title"]').getValue(), `${PROJECT_TITLE} - updated`);
      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();

      assert.ok(await browser.$('button=Continue').isDisplayed());
    });
  });
});
