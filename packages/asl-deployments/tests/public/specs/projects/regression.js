import assert from 'assert';

import {
  gotoProjectLandingPage,
  gotoProjectManagementPage,
  gotoGranted,
  gotoDraft,
  discardAmendment,
  completeAwerb,
  discardTask,
  createNewProject,
  discardDraft,
  gotoDownloadsTab
} from '../../helpers/project.js';

import {
  findTask
} from '../../../helpers/task.js';

describe('Project regression tests', () => {
  before(async() => {
    await browser.withUser('holc');
  });

  describe('Legacy project', () => {

    afterEach(async() => {
      await browser.waitForSync();
      await discardAmendment(browser, 'Legacy project');
    });

    it('can update other-species in legacy PPLs', async() => {
      await gotoProjectManagementPage(browser, 'Legacy other species test');
      await browser.$('button=Amend licence').click();
      await browser.$('a=Protocols').click();

      const panel = await browser.$('.protocol.panel');
      await panel.$('input[type=text]').setValue('Protocol one');
      await panel.$('button=Continue').click();

      await browser.$('h3*=Type of animals').click();

      let section = await browser.$('section.legacy-animals');

      await section.$('select').selectByVisibleText('Other species');
      await section.$$('input[type="text"]')[0].setValue('JABU');

      // click the continue button at the bottom of the page, not the one in the protocol
      await browser.$('p.control-panel').$('button=Continue').click();

      await browser.$('section.protocol').click();
      await browser.$('h3*=Type of animals').click();

      section = await browser.$('section.legacy-animals');
      const otherSpecies = await section.$$('.review')[0].$$('p')[0].getText();
      assert.equal(otherSpecies, 'JABU');

      await browser.waitForSync();

      const pdf = await browser.downloadFile('pdf');
      assert.ok(pdf.includes('JABU'));

      const word = await browser.downloadFile('word');
      assert.ok(word.includes('JABU'));
    });

    it('displays the continued use / re-use subheadings in legacy pdf', async() => {
      await gotoGranted(browser, 'Legacy project');
      const pdf = await browser.downloadFile('pdf');
      assert.ok(pdf.includes('a) Continued use'), 'PDF should contain subheading for continued use');
      assert.ok(pdf.includes('b) Re-use'), 'PDF should contain subheading for re-use');
    });
  });

  describe('Draft with withdrawn', () => {
    beforeEach(async() => {
      await gotoDraft(browser, 'Draft with withdrawn');
    });

    afterEach(async() => {
      await browser.waitForSync();
    });

    it('doesn\'t show changed labels when a new application is withdrawn and then amended', async() => {
      await browser.$('a=Introductory details').click();
      await browser.$('input[name="title"]').setValue('Draft with withdrawn amended');

      await browser.$('.control-panel').$('button').click();

      const changedLabel = await browser.$$('.review')[0].$('span.changed');
      assert.ok(!await changedLabel.isDisplayed(), 'Changed label should not show on application');
    });
  });

  describe('Licence holder can action if submitted by HOLC', async() => {

    it('shows the in-progress task in the licence holder\'s task list', async() => {
      await gotoProjectManagementPage(browser, 'Basic user project');

      await browser.$('button=Amend licence').click();

      await browser.waitForSync();

      await browser.$('button=Continue').click();

      assert.equal(await browser.$('h1').getText(), 'Send amendment');

      await completeAwerb(browser);

      await browser.$('textarea[name=comments]').setValue('Reason for the change');
      await browser.$('button*=Submit PPL amendment').click();
      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Project amendment');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

      await browser.withUser('basic');

      await browser.$('a=In progress').click();

      const cells = await Promise.all(await browser
        .$$('table.tasklist tbody td.type')
        .map(td => td.getText()));

      assert.ok(cells.includes('PPL amendment\nBasic User'));

      await browser.withUser('holc');
      await discardTask(browser, 'Basic user project');
    });
  });

  describe('Legacy list formats render correctly in word download', () => {

    it('can download a document showing legacy list items rednered correctly', async() => {

      await gotoProjectLandingPage(browser, 'Project with legacy list');
      await gotoDownloadsTab(browser);

      const word = await browser.downloadFile({ type: 'word', selector: 'a=Download application (DOCX)' });
      assert.ok(word.includes('List item 1'));
      assert.ok(word.includes('List item 2'));
    });

  });

  it('Legacy permissible purposes show in NTS', async() => {
    await gotoProjectLandingPage(browser, 'Legacy permissible purpose NTS regression');
    await browser.$('a=Non-technical summary').click();
    const container = await browser.$('h3=Project purpose').parentElement().$('ul');
    assert.ok(await container.$('li*=(a)').isDisplayed());
    assert.ok(await container.$('li*=(b)').isDisplayed());
    assert.ok(await container.$('li*=(i)').isDisplayed());
    assert.ok(await container.$('li*=(ii)').isDisplayed());
    assert.ok(await container.$('li*=(iii)').isDisplayed());
    assert.ok(await container.$('li*=(c)').isDisplayed());
    assert.ok(await container.$('li*=(d)').isDisplayed());
    assert.ok(await container.$('li*=(e)').isDisplayed());
    assert.ok(await container.$('li*=(g)').isDisplayed());
  });

  it('can remove species details from legacy protocols', async() => {
    await gotoProjectLandingPage(browser, 'Draft legacy project', 'Drafts');
    await browser.$('a=Open application').click();
    await browser.$('a=Protocols').click();
    await browser.$('button=Continue').click();
    await browser.$('h3*=Type of animals').click();
    assert.equal(await browser.$$('.legacy-animals > .content > fieldset').length, 1);

    await browser.$('button=Add another item').click();
    assert.equal(await browser.$$('.legacy-animals > .content > fieldset').length, 2);

    await browser.$('a=Remove').click();
    await browser.acceptAlert();

    assert.equal(await browser.$$('.legacy-animals > .content > fieldset').length, 1);
    // ensure other tests do not get blocked by a syncing alert
    await browser.waitForSync();
  });

  describe('Species selector', () => {
    beforeEach(async() => {
      await createNewProject(browser, 'Testing selector');
    });

    afterEach(async() => {
      await browser.waitForSync();

      await discardDraft(browser, 'Testing selector');
    });

    it('doesn\'t deselect options when species are selected from different groups', async() => {
      await browser.$('summary=Small animals').click();
      await browser.$('label=Mice').click();
      await browser.$('label=Rats').click();
      await browser.$('label=Guinea pigs').click();
      await browser.$('summary=Large animals').click();
      await browser.$('label=Pigs').click();
      await browser.$('label=Goats').click();
      await browser.$('label=Sheep').click();

      await browser.waitForSync();

      assert.ok(await browser.$('fieldset#SA').isDisplayed(), 'SA should be autoexpanded');
      assert.ok(await browser.$('fieldset#LA').isDisplayed(), 'LA should be autoexpanded');

      for (const animal of ['mice', 'rats', 'guinea-pigs', 'pigs', 'goats', 'sheep']) {
        assert.ok(await browser.$(`input[value="${animal}"]:checked`).isExisting(), `Expected ${animal} to be checked`);
      }
    });

    it('can add other species', async() => {
      await browser.$('summary=Small animals').click();
      await browser.$('label=Other rodents').click();
      await browser.$('#species-other-rodents-0').setValue('Pinky');
      await browser.$('fieldset#SA').$('button=Add another').click();
      await browser.$('#species-other-rodents-1').setValue('The Brain');
      await browser.$('summary=Fish, reptiles and aquatic species').click();
      await browser.$('label=Other fish').click();
      await browser.$('#species-other-fish-0').setValue('Sharky');
      await browser.$('fieldset#AQ').$$('button=Add another')[2].click();
      await browser.$('#species-other-fish-1').setValue('George');

      await browser.waitForSync();

      assert.equal(await browser.$('#species-other-rodents-0').getAttribute('value'), 'Pinky');
      assert.equal(await browser.$('#species-other-rodents-1').getAttribute('value'), 'The Brain');
      assert.equal(await browser.$('#species-other-fish-0').getAttribute('value'), 'Sharky');
      assert.equal(await browser.$('#species-other-fish-1').getAttribute('value'), 'George');
    });
  });

  it('recalling a PPL task with an expired deadline should not diplay ASRU UI to external users', async() => {
    await browser.url('/');
    await browser.$('a=In progress').click();
    await browser.$('table:not(.loading)').waitForExist();

    await findTask(browser, '[title="Testing deadline passed external"] a');

    await browser.$('[title="Testing deadline passed external"] a').click();

    await browser.$('label=Recall application').click();
    await browser.$('button=Continue').click();

    assert(!await browser.$('input[name="deadline-passed-reason"]').isDisplayed(), 'there should not be an input for deadline passed reason');
    assert(await browser.$('h1=Recall application').isDisplayed(), 'the correct recall content should be displayed');
  });

});
