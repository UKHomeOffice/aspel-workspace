import assert from 'assert';
import { gotoProfilePage } from '../../helpers/profile.js';
import { gotoProjectLandingPage, gotoManageTab } from '../../helpers/project.js';

const PROJECT_TITLE = 'Digitised legacy PPL';
const LICENCE_NUMBER = 'XXX-123-ZZZ';

const completeRichTextField = async (browser, name, text) => {
  await browser.$(`[name="${name}"]`).completeRichText(text);
  await browser.waitForSync();
};

describe('Digitising paper PPLs', () => {
  before(async () => {
    await browser.withUser('inspector');
  });

  describe('Create a legacy licence project stub', () => {
    beforeEach(async () => {
      await gotoProfilePage(browser, 'Joelly Harbar');
      await browser.$('h3=University of Croydon').click();
      await browser.$('a=Convert existing project').click();
    });

    it('requires basic details to create the stub', async () => {
      await browser.$('button=Continue').click();
      const formErrors = await browser.$$('.govuk-error-message').map(errorMessage => errorMessage.getText());

      assert(formErrors.includes('Enter the name of the project'), 'project title should be a required field');
      assert(formErrors.includes('Enter the licence number'), 'licence number should be a required field');
      assert(formErrors.includes('Enter a valid date'), 'issue date should be a required field');
      assert(formErrors.includes('Enter the duration of the licence'), 'project duration should be a required field');
    });

    it('create a project stub', async () => {
      await browser.$('input[name=title]').setValue(PROJECT_TITLE);
      await browser.$('input[name=licenceNumber]').setValue(LICENCE_NUMBER);
      await browser.$('input[name=issueDate-day]').setValue('10');
      await browser.$('input[name=issueDate-month]').setValue('10');
      await browser.$('input[name=issueDate-year]').setValue('2023');
      await browser.$('select[name=years]').selectByAttribute('value', '5');
      await browser.$('select[name=months]').selectByAttribute('value', '0');

      await browser.$('button=Continue').click();

      assert(browser.$(`dd=${PROJECT_TITLE}`).isDisplayed(), 'project title is displayed on the confirm page');
      assert(browser.$(`dd=${LICENCE_NUMBER}`).isDisplayed(), 'licence number is displayed on the confirm page');
      assert(browser.$('dd*=10 October 2023').isDisplayed(), 'issue date is displayed on the confirm page');
      assert(browser.$('dd=5 years 0 months').isDisplayed(), 'project duration is displayed on the confirm page');

      const warningText = await browser.$('.govuk-warning-text__text').getText();
      assert(warningText.includes('Continuing will create a partial record of this licence'), 'warning message is displayed');

      await browser.$('a=Change').click();
      assert(browser.$('input[name=title]').isDisplayed(), 'change button takes user back to the form');

      await browser.$('button=Continue').click();
      await browser.$('button=Create partial record').click();

      assert(browser.$('.document-header').$(`h2=${PROJECT_TITLE}`).isDisplayed(), 'project title is displayed on the landing page');
      assert(browser.$(`dd*=${LICENCE_NUMBER}`).isDisplayed(), 'licence number is displayed on the landing page');
      assert(browser.$('dd*=10 October 2023').isDisplayed(), 'issue date is displayed on the landing page');
      assert(browser.$('dd*=10 October 2028').isDisplayed(), 'expiry date is displayed on the landing page');

      const text = await browser.$('.licence-status-banner .status').getText();
      assert.equal(text, 'PARTIAL RECORD', 'landing page has a PARTIAL RECORD status banner');

      await gotoManageTab(browser);

      assert(browser.$('button=Edit record').isDisplayed(), 'there is a button to fill out the project stub with more details');
      assert(browser.$('button=Cancel licence conversion').isDisplayed(), 'there is a button to cancel the conversion and delete the stub');
      assert(browser.$('a=Revoke licence').isDisplayed(), 'there is a button to revoke the stub licence');
    });
  });

  describe('convert a project stub', () => {
    beforeEach(async () => {
      await gotoProfilePage(browser, 'Joelly Harbar');
      await browser.$('h3=University of Croydon').click();
      await browser.$(`a=${PROJECT_TITLE}`).click();
      await gotoManageTab(browser);
      await browser.$('button=Edit record').click();
    });

    it('can add additional licence details to the existing stub licence', async () => {
      await browser.$('a=Experience').click();
      await completeRichTextField(browser, 'experience-knowledge', 'Some info on experience.');
      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();

      await browser.$('a=Resources').click();
      await completeRichTextField(browser, 'other-resources', 'Some other resources.');
      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();

      const changedBadges = await browser.$$('span.badge.changed');
      assert.equal(changedBadges.length, 2, 'experience and resource sections are marked as changed');

      await browser.waitForSync();
    });

    it('can re-enter the same new draft from the landing page and continue adding details', async () => {
      const existingChangedBadges = await browser.$$('span.badge.changed');
      assert.equal(existingChangedBadges.length, 2, 'experience and resource sections are already marked as changed');

      await browser.$('a=Background').click();
      await completeRichTextField(browser, 'background', 'Some background info.');
      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();

      await browser.$('a=Benefits').click();
      await completeRichTextField(browser, 'benefits', 'Some benefits.');
      await browser.$('button=Continue').click();
      await browser.$('button=Continue').click();

      const changedBadges = await browser.$$('span.badge.changed');
      assert.equal(changedBadges.length, 4, 'background and benefits sections also marked as changed');

      await browser.waitForSync();
    });

    it('can submit the draft to convert the licence stub into a regular legacy licence', async () => {
      await browser.$('button=Continue to final confirmation').click();
      assert(browser.$('h1=Finish converting licence').isDisplayed(), 'clicking continue should take you to the convert licence confirmation page');

      await browser.$('button=Convert licence').click();
      await browser.waitForSuccess();

      await gotoProjectLandingPage(browser, PROJECT_TITLE);

      assert(browser.$('.document-header').$(`h2=${PROJECT_TITLE}`).isDisplayed(), 'project title is displayed on the landing page');
      assert(browser.$(`dd=${LICENCE_NUMBER}`).isDisplayed(), 'licence number is displayed on the landing page');
      assert(!await browser.$('.licence-status-banner').isDisplayed(), 'there should no longer be a licence status banner');
      assert(browser.$('a=View licence').isDisplayed(), 'there is a link to the granted licence');

      await browser.$('a=View licence').click();
      await browser.$('a=Experience').click();
      assert(browser.$('span=Some info on experience.').isDisplayed(), 'the licence displays the extra information added to the stub');
    });
  });

});
