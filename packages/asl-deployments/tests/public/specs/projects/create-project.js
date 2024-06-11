import assert from 'assert';
import { gotoProjectList, createNewProject, discardDraft } from '../../helpers/project.js';
import { gotoProfile } from '../../helpers/profile.js';

describe('Create project', () => {
  before(async() => {
    await browser.withUser('holc');
  });

  afterEach(async() => {
    await browser.waitForSync();
  });

  it('can create a new draft project', async() => {
    await gotoProjectList(browser);
    await browser.$('button=Apply for project licence').click();
    await browser.$('.document-header h2').waitForExist();

    const projectTitle = await browser.$('.document-header h2').getText();
    assert.equal(projectTitle, 'Untitled project');
  });

  it('can create a new draft project from the dashboard', async() => {
    await browser.url('/');

    await browser.$('h3=University of Croydon').click();

    await browser.$('.expanding-panel.open').$('button=Apply for project licence').click();
    await browser.$('.document-header h2').waitForExist();

    const projectTitle = await browser.$('.document-header h2').getText();
    assert.equal(projectTitle, 'Untitled project');
  });

  it('can create a new draft project for another user', async() => {
    await gotoProfile(browser, 'Dagny Aberkirder');
    await browser.$('button=Apply for project licence').click();
    await browser.$('.document-header h2').waitForExist();

    const projectTitle = await browser.$('.document-header h2').getText();
    assert.equal(projectTitle, 'Untitled project');

    await browser.$('a.toggle-details').click();
    const details = await browser.$('.details').getText();
    assert(details.includes('Dagny Aberkirder'), 'The correct licence holder should be displayed');
  });

  it('can change the title of a draft project', async() => {
    await createNewProject(browser, 'Empty draft project');

    await browser.$('//a[text()="List of sections"]');
    const projectTitle = await browser.$(`.document-header h2`).getText();
    assert.ok(projectTitle.includes('Empty draft project'), 'Failed to change the title of a draft project');

    await discardDraft(browser, 'Empty draft project');
  });

  it('can leave the duration of a project blank without getting stuck in a sync loop - regression', async() => {
    await createNewProject(browser, 'Empty duration project');

    await browser.refresh();

    await browser.$('input[name="title"]').setValue('Empty duration project edited');
    await browser.waitForSync();

    await browser.refresh();
    assert.equal(await browser.$('input[name="title"]').getValue(), 'Empty duration project edited');
  });

  it('can add protocols to a draft project', async() => {
    await createNewProject(browser, 'Project with protocols');

    await browser.$('//a[text()="List of sections"]').click();
    await browser.$('a=Protocols').click();

    await browser.$('h1=Protocols').waitForExist();

    await browser.$('.protocol.panel input[type="text"]').setValue('First protocol');
    await browser.$('.protocol.panel').$('button=Continue').click();
    assert.ok(await browser.$('h2*=First protocol').isDisplayed(), 'First protocol not created');

    await browser.$('button=Add another protocol').scrollIntoView({ block: 'center' });
    await browser.$('button=Add another protocol').click();
    await browser.$('.protocol.panel input[type="text"]').setValue('Second protocol');
    await browser.$('.protocol.panel').$('button=Continue').click();
    assert.ok(await browser.$('h2*=Second protocol').isDisplayed(), 'Second protocol not created');

    await browser.$('button=Add another protocol').scrollIntoView({ block: 'center' });
    await browser.$('button=Add another protocol').click();
    await browser.$('.protocol.panel input[type="text"]').setValue('Third protocol');
    await browser.$('.protocol.panel').$('button=Continue').click();
    assert.ok(await browser.$('h2*=Third protocol').isDisplayed(), 'Third protocol not created');

    assert.ok(await browser.$$('section.protocol').length === 3, 'Could not find 3 protocols');
  });

  it('can edit species in project with empty protocols without error - regression', async() => {
    await createNewProject(browser, 'Project with empty protocols');

    await browser.$('//a[text()="List of sections"]').click();
    await browser.$('a=Protocols').click();

    await browser.$('h1=Protocols').waitForExist();

    await browser.$('.protocol.panel input[type="text"]').setValue('First protocol');
    await browser.$('.protocol.panel').$('button=Continue').click();

    await browser.$('//a[text()="List of sections"]').click();

    await browser.$('a=Introductory details').click();

    await browser.$('summary=Small animals').click();

    await browser.$('input[type="checkbox"][value="mice"]').click();
    await browser.waitForSync();

    await browser.refresh();

    assert.ok(await browser.$('input[type="checkbox"][value="mice"]:checked').isExisting());
  });

  it('can add species and remove species in a draft project', async() => {
    await createNewProject(browser, 'Project with species');

    await browser.$('.species-selector').$('summary=Small animals').click();
    await browser.$('input[name="SA"][value="rats"]').click();

    await browser.$('input[name="SA"][value="other-rodents"]').click();
    await browser.$('.species-selector-other input[type="text"]').setValue('Chipmunks');
    await browser.$('button=Add another').click();
    await browser.$$('.species-selector-other input[type="text"]')[1].setValue('Chinchillas');
    await browser.$('button=Add another').click();
    await browser.$$('.species-selector-other input[type="text"]')[2].setValue('Capybaras');

    await browser.$$('.species-selector-other')[1].$('button=Remove').click();
    await browser.waitForSync();
    await browser.$('.control-panel').$('button=Continue').click();

    assert.ok(await browser.$('li=Rats').isDisplayed(), 'Rats should be present in species list');
    assert.ok(await browser.$('li=Chipmunks').isDisplayed(), 'Chipmunks should be present in species list');
    assert.ok(await browser.$('li=Capybaras').isDisplayed(), 'Capybaras should be present in species list');
    assert.ok(!await browser.$('li=Chinchillas').isDisplayed(), 'Chinchillas should have been removed from species list');
  });

  it('read user cannot create a new draft project for another user', async() => {
    await browser.withUser('read');
    await gotoProfile(browser, 'Dagny Aberkirder');
    assert.ok(!await browser.$('button=Apply for project licence').isDisplayed(), 'There should not be an apply for project licence button');
  });

  it('basic user cannot create a new draft project for another user', async() => {
    await browser.withUser('basic');
    await gotoProfile(browser, 'Bruce Banner');
    assert.ok(!await browser.$('button=Apply for project licence').isDisplayed(), 'There should not be an apply for project licence button');
  });
});
