import assert from 'assert';
import { gotoProfilePage } from '../../helpers/profile.js';

describe('ASRU user amending PIL', () => {

  it('gets immediately resolved if an inspector amends a PIL', async () => {
    await browser.withUser('inspector');

    await gotoProfilePage(browser, 'Dagny Aberkirder');

    await browser.$('a[href*="/pil/"]').click();
    await browser.$('a=Amend licence').click();

    await browser.$('a=Animal types').click();
    await browser.$('summary=Small animals').click();
    await browser.$('label=Mice').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Training').click();
    await browser.$('label[for*="update-false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Procedures').click();
    await browser.$('input[name="procedures"][value="A"]').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Continue').click();
    await browser.$('textarea').setValue('Amending PIL as inspector');
    await browser.$('button=Submit to licensing').click();

    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Approved');

    await gotoProfilePage(browser, 'Dagny Aberkirder');
    await browser.$('a[href*="/pil/"]').click();
    assert(browser.$('li*=Mice').isDisplayed(), 'licence shows amended species');
    assert(browser.$('li*=Minor / minimally invasive procedures not requiring sedation, analgesia or general anaesthesia.').isDisplayed(), 'licence shows amended procedure');

  });

  it('gets immediately resolved if a Licensing officer amends a PIL', async () => {
    await browser.withUser('licensing');

    await gotoProfilePage(browser, 'Ondrea Beining');
    await browser.$('a[href*="/pil/"]').click();
    await browser.$('a=Amend licence').click();

    await browser.$('a=Animal types').click();
    await browser.$('summary=Small animals').click();
    await browser.$('label=Mice').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Training').click();
    await browser.$('label[for*="update-false"]').click();
    await browser.$('button=Continue').click();

    await browser.$('a=Procedures').click();
    await browser.$('input[name="procedures"][value="C"]').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Continue').click();
    await browser.$('textarea').setValue('Ameng PIL as licensing');
    await browser.$('button=Update licence').click();

    await browser.waitForSuccess();
    assert.equal(await browser.$('.page-header h1').getText(), 'Personal licence amendment');
    assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Approved');

    await gotoProfilePage(browser, 'Ondrea Beining');
    await browser.$('a[href*="/pil/"]').click();
    assert(browser.$('li*=Surgical procedures involving general anaesthesia').isDisplayed(), 'licence shows amended procedure');

    await browser.$('table.tasklist').$('a=PIL amendment').click();
    let sections = await browser.$$('.sticky-nav a').map(link => link.getText());
    assert.deepStrictEqual(sections,
      ['Details', 'Status', 'Latest activity', 'Procedures', 'Animal types', 'Training', 'Task assignment']);
  });

  it('gets autoresolved if an ASRU Licensing officer adds a condition to PIL', async () => {
    await browser.withUser('licensing');

    await gotoProfilePage(browser, 'Evvy Addams');
    await browser.$('a[href*="/pil/"]').click();
    await browser.$('a=Add conditions').click();

    await browser.$('textarea').setValue('Condition added to PIL');
    await browser.$('button=Submit').click();

    await browser.waitForSuccess();

    await browser.$('table.tasklist').$('a=Update conditions').click();
    let sections = await browser.$$('.sticky-nav a').map(link => link.getText());
    assert.deepStrictEqual(sections,
      ['Details', 'Status', 'Latest activity', 'Additional conditions', 'Task assignment']);
  });
});
