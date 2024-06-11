import assert from 'assert';
import {
  createNewProject,
  discardAmendment,
  discardDraft,
  gotoDraft,
  gotoProjectLandingPage,
  gotoProjectManagementPage
} from '../../helpers/project.js';

describe('Create project', () => {

  const title = 'Additional availability addition and removal test';
  let fullTitle;

  before(async() => {
    await browser.withUser('holc');
    fullTitle = await createNewProject(browser, title);
  });

  afterEach(async() => {
    await browser.waitForSync();
  });

  after(async() => {
    await discardDraft(browser, fullTitle);
  });

  it('can add additional establishments to a draft', async() => {
    await gotoDraft(browser, fullTitle);

    await browser.$('a=Establishments').click();
    await browser.$('input[name="other-establishments"][value="true"]').click();
    await browser.$('button=Continue').click();

    await browser.$('button=Add another additional establishment').click();

    // Clicking a radio removes it from the other establishments' options. This moves the position causing
    // issues where the radios move between being queried and clicked, which selects the wrong establishment.
    // Additionally, when scrolling about the page, the sticky header can get in the way, causing the click to
    // fail.
    async function clickRadio(sectionTitle, establishmentName) {
      let label = await browser.$(
        `//h2[text()="${sectionTitle}"]/following-sibling::fieldset//label[text()="${establishmentName}"]`
      );

      await label.scrollIntoView({ block: 'center' });
      await label.click();
      await browser.waitForSync();
    }

    await clickRadio('Additional establishment 1', 'Marvell Pharmaceutical');
    await clickRadio('Additional establishment 2', 'Small Pharma');

    await gotoProjectLandingPage(browser, fullTitle, 'Drafts');

    assert.ok(await browser.$('//*[contains(@class,"licence-details")]//li[text()="Marvell Pharmaceutical"]').isDisplayed());
    assert.ok(await browser.$('//*[contains(@class,"licence-details")]//li[text()="Small Pharma"]').isDisplayed());
  });

  it('can remove additional establishments from a draft', async() => {
    await gotoDraft(browser, fullTitle);

    await browser.$('a=Establishments').click();
    await browser.$('button=Continue').click();

    const panels = await browser.$$('.aa-establishment.panel');

    await panels[1].$('a=Remove').click(); // Small Pharma

    await browser.waitForSync();

    assert.ok(await panels[1].parentElement().$('.badge.deleted').isDisplayed());

    await gotoProjectLandingPage(browser, fullTitle, 'Drafts');

    await browser.$('.licence-details').$('li=Marvell Pharmaceutical').waitForDisplayed();
    assert.ok(!await browser.$('.licence-details').$('li=Small Pharma').isDisplayed());
  });

});

describe('Amend project', () => {
  const title = 'Additional availability active';

  before(async() => {
    await browser.withUser('additionalavailability');
  });

  afterEach(async() => {
    await browser.waitForSync();
  });

  after(async() => {
    await discardAmendment(browser, title);
  });

  it('Active AA establishments appear as selectable protocol locations', async() => {
    await gotoProjectManagementPage(browser, title);
    await browser.$('button=Amend licence').click();

    await browser.$('a=Protocols').click();
    await browser.$('h2*=First protocol').click();

    assert.ok(await browser.$('.location-selector').$('label=Small Pharma').isDisplayed());
  });

  it('Removed AA establishments do not appear as selectable protocol locations', async() => {
    await gotoProjectManagementPage(browser, title);
    await browser.$('button=Edit amendment').click();

    await browser.$('a=Establishments').click();
    await browser.$('button=Continue').click();
    await browser.$('a=Remove').click();

    assert.ok(await browser.$('.badge.deleted').isDisplayed());

    await browser.$('.control-panel').$('button=Continue').click();
    await browser.$('.control-panel').$('button=Continue').click();
    await browser.$('button=Continue').click();

    await browser.waitForSync();
    assert.ok(await browser.$('//a[text()="Protocols"]/ancestor::tr//*[@class="badge changed"]').isDisplayed(), 'Changed badge should appear on Protocols section');

    await browser.$('a=Protocols').click();
    await browser.$('h2*=First protocol').click();

    assert.ok(!await browser.$('.location-selector').$('label=Small Pharma').isDisplayed(), 'Small Pharma should no-longer be in the selectable locations');
  });
});
