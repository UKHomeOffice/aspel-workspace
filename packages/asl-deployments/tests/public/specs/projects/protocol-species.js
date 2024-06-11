import assert from 'assert';

import { gotoDraft, gotoProjectManagementPage } from '../../helpers/project.js';

describe('Protocol species regression tests', () => {
  before(async() => {
    await browser.withUser('holc');
  });

  it('shows correct species details in protocol', async() => {
    await gotoDraft(browser, 'Unmigrated Species');
    await browser.$('a=Protocols').click();

    await browser.$('h3*=Animals used in this protocol').click();

    assert.ok(await browser.$('h3=Mice').isDisplayed(), 'A species details section for mice should be displayed');
    assert.ok(await browser.$('h3=Zebra fish (Danio rerio)').isDisplayed(), 'A species details section for zebra fish should be displayed');

  });

  it('flags protocols as changed if their species are removed at project level', async() => {
    await gotoProjectManagementPage(browser, 'Removing project level species shows protocols as changed');
    await browser.$('button=Amend licence').click();

    assert.ok(!await browser.$('//a[text()="Protocols"]/ancestor::tr').$('td.controls').$('.badge.changed').isDisplayed(), 'there should not be a changed badge on protocols section');
    await browser.$('a=Protocols').click();

    const sections = await browser.$$('section.protocol');
    for (const section of sections) {
      assert.ok(!await section.$('span.badge.changed').isDisplayed(), 'there should be no changed badges');
    }

    // remove Rats at project level
    await browser.$('a.sections-link').click();
    await browser.$('a=Introductory details').click();
    await browser.$('input[name="SA"][value="rats"]').click();
    await browser.acceptAlert();

    await browser.$('button=Continue').click();
    await browser.$('button=Continue').click();

    await browser.waitForSync();

    assert.ok(await browser.$('//a[text()="Protocols"]/ancestor::tr').$('td.controls').$('.badge.changed').isDisplayed(), 'there should be a changed badge on protocols section');

    await browser.$('a=Protocols').click();

    const protocolSections = await browser.$$('section.protocol');

    assert.ok(await protocolSections[0].$('span.badge.changed').isDisplayed(), 'First protocol should have a changed badge');
    assert.ok(await protocolSections[1].$('span.badge.changed').isDisplayed(), 'Second protocol should have a changed badge');
    assert.ok(!await protocolSections[2].$('span.badge.changed').isDisplayed(), 'Third protocol should not have a changed badge');
  });

});
