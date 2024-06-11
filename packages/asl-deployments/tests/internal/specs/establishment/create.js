import assert from 'assert';
import { gotoEstablishmentDetails } from '../../helpers/establishment.js';

const ESTABLISHMENT_NAME = 'ZZ-TopTech';

describe('Establishment', () => {

  describe('Create', () => {

    before(async () => {
      await browser.withUser('licensing');
    });

    beforeEach(async () => {
      await browser.url('/');
      await browser.$('a=Establishments').click();
    });

    it('ASRU user cannot create an establishment without a name or type', async () => {
      await browser.$('a=Create inactive establishment').click();
      await browser.$('button=Submit').click();

      const errorMessages = await browser.$$('.govuk-error-message').map(error => error.getText());
      assert.ok(errorMessages.includes('Please enter the name of your new establishment'), 'error is shown if no name');
      assert.ok(errorMessages.includes('Please enter the type of your new establishment'), 'error is shown if no type');
    });

    it('ASRU user creates a new inactive corporate establishment', async () => {
      await browser.$('a=Create inactive establishment').click();
      await browser.$('input[name=name]').setValue(ESTABLISHMENT_NAME);
      await browser.$('input[name="corporateStatus"][value="corporate"]').click();
      await browser.$('button=Submit').click();
      await browser.$('.document-header').$(`h2=${ESTABLISHMENT_NAME}`).waitForDisplayed();
      assert(await browser.$('.document-header').$(`h2=${ESTABLISHMENT_NAME}`).isDisplayed(), 'should be redirected to the new establishment dashboard');
      assert(await browser.$('.licence-status-banner.inactive').isDisplayed(), 'the licence is inactive');
    });

    it('A draft establishment licence PDF can be downloaded', async () => {
      await gotoEstablishmentDetails(browser, ESTABLISHMENT_NAME, 'Draft');
      await browser.$('a=View downloads').click();
      assert(await browser.$('.document-header').$('a=Download licence as a PDF').isDisplayed(), 'There should be a link to download the pdf licence');
      await browser.$('a=Hide downloads').click();

      const pdf = await browser.downloadFile('pdf');
      assert.ok(pdf.includes(ESTABLISHMENT_NAME), 'PDF is the establishment licence');
      assert.ok(pdf.includes('This licence is not active. The establishment is not authorised'), 'PDF header includes licence status banner');
      assert.ok(pdf.includes('DRAFT'), 'PDF header includes status DRAFT');
    });

  });

});
