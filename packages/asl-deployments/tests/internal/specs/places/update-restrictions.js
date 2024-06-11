import assert from 'assert';
import { applySiteFilter } from '../../../helpers/place.js';
import { gotoEstablishmentDashboard } from '../../helpers/establishment.js';

async function goToApprovedAreas(browser) {
  await gotoEstablishmentDashboard(browser, 'University of Croydon');
  await browser.$('a=Approved areas').click();
}

describe('Updating restrictions', () => {
  describe('Inspector', () => {

    before(async () => {
      await browser.withUser('inspector');
    });

    beforeEach(async () => {
      await goToApprovedAreas(browser);

      await applySiteFilter(browser, 'Internal restrictions tests');
      await browser.$('tbody').$('a=Default').click();
      await browser.$('a=Amend area').click();
    });

    it('can add restrictions from the SOP', async () => {
      await browser.$('.editable-field').$('a=Add').click();
      await browser.$('.editable-field textarea').setValue('A new restriction');
      await browser.$('button=Done').click();

      await browser.$('button*=Continue').click();

      assert.equal(await browser.$('.editable-field .highlight').getText(), 'A new restriction');

      await browser.$('button*=Submit').click();

      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Area amendment');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Approved');

      await goToApprovedAreas(browser);

      await applySiteFilter(browser, 'Internal restrictions tests');
      await browser.$('tbody').$('a=Default').click();

      const warningText = await browser.$('.model-summary dd:last-of-type').getText();
      assert.ok(warningText.includes('A new restriction'));
    });

    it('can update restrictions from the SOP', async () => {
      await browser.$('.editable-field').$('a=Edit').click();
      await browser.$('.editable-field textarea').setValue('Edited restrictions');
      await browser.$('button=Done').click();

      await browser.$('button*=Continue').click();

      assert.equal(await browser.$('.editable-field .highlight').getText(), 'Edited restrictions');

      await browser.$('button*=Submit').click();

      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Area amendment');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Approved');

      await goToApprovedAreas(browser);

      await applySiteFilter(browser, 'Internal restrictions tests');
      await browser.$('tbody').$('a=Default').click();

      const warningText = await browser.$('.model-summary dd:last-of-type').getText();
      assert.ok(warningText.includes('Edited restrictions'));
    });

    it('can remove restrictions from the SOP', async () => {
      await browser.$('.editable-field').$('a=Remove').click();
      await browser.acceptAlert();

      await browser.$('button*=Continue').click();

      assert.equal(await browser.$('.editable-field .highlight').getText(), 'None');

      await browser.$('button*=Submit').click();

      await browser.waitForSuccess();
      assert.equal(await browser.$('.page-header h1').getText(), 'Area amendment');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Approved');

      await goToApprovedAreas(browser);

      await applySiteFilter(browser, 'Internal restrictions tests');
      await browser.$('tbody').$('a=Default').click();

      const warningText = await browser.$('.model-summary dd:last-of-type').getText();
      assert.ok(warningText.includes('No restrictions'));
    });

  });

  describe('Licensing officer', () => {
    beforeEach(async () => {
      await browser.withUser('licensing');
    });

    it('can add restrictions from the SOP creating a task for inspector', async () => {
      await goToApprovedAreas(browser);

      await applySiteFilter(browser, 'Internal restrictions tests');
      await browser.$('tbody').$('a=Default').click();

      await browser.$('a=Amend area').click();

      await browser.$('.editable-field').$('a=Add').click();
      await browser.$('.editable-field textarea').setValue('New restrictions from licensing');
      await browser.$('button=Done').click();

      await browser.$('button*=Continue').click();

      assert.equal(await browser.$('.editable-field .highlight').getText(), 'New restrictions from licensing');

      await browser.$('button*=Submit').click();

      assert.equal(await browser.$('.page-header h1').getText(), 'Area amendment');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Submitted');

      await browser.withUser('inspector');

      await goToApprovedAreas(browser);

      await applySiteFilter(browser, 'Internal restrictions tests');
      await browser.$('tbody').$('a=Default').click();

      await browser.$('.tasklist').$('a=Area amendment').click();

      assert.equal(await browser.$('#restrictions .highlight').getText(), 'New restrictions from licensing');

      await browser.$('#restrictions').$('a=Edit').click();
      await browser.$('#restrictions textarea').waitForExist();
      await browser.$('#restrictions textarea').setValue('Restrictions from inspector');
      await browser.$('button=Done').click();

      await browser.$('label=Amend licence').click();
      await browser.$('button=Continue').click();
      await browser.$('button=Amend licence').click();

      assert.equal(await browser.$('.page-header h1').getText(), 'Area amendment');
      assert.equal(await browser.$('h1.govuk-panel__title').getText(), 'Approved');

      await goToApprovedAreas(browser);

      await applySiteFilter(browser, 'Internal restrictions tests');
      await browser.$('tbody').$('a=Default').click();

      const warningText = await browser.$('.model-summary dd:last-of-type').getText();
      assert.ok(warningText.includes('Restrictions from inspector'));
    });
  });
});
